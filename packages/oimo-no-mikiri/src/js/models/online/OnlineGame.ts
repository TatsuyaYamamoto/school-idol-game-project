import firebase from "firebase/app";
import { FirebaseClient } from "@sokontokoro/mikan";

import { isUndefined } from "util";
import Mode from "../Mode";
import Game from "../Game";
import Actor from "../Actor";
import OnlineBattle from "./OnlineBattle";

export enum GameEvents {
  REQUESTED_START = "requested_start",
  IS_READY = "is_ready",
  CREATED = "game_created",
  MEMBER_JOINED = "member_joined",
  FULFILLED_MEMBERS = "fulfilled_members",
  MEMBER_LEFT = "member_left",
  ROUND_PROCEED = "round_proceed",
}

class OnlineGame extends Game {
  readonly _id: string;

  readonly _members: Map<string, boolean>;

  private _gameRef: firebase.database.Reference;

  constructor(id: string) {
    super(Mode.MULTI_ONLINE);
    this._id = id;
    this._members = new Map<string, boolean>();

    this._gameRef = FirebaseClient.database.ref(
      `/oimo-no-mikiri/games/${this._id}`
    );
  }

  /** **********************************************************************************
   * Static methods
   */
  public static async create(): Promise<OnlineGame> {
    const gamesRef = FirebaseClient.database.ref(`/oimo-no-mikiri/games`);
    const newGameId = gamesRef.push().key;
    const newGameRef = gamesRef.child(newGameId);

    await newGameRef.set({
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    });
    newGameRef.onDisconnect().set(null);

    return new OnlineGame(newGameId);
  }

  /** **********************************************************************************
   * Accessor
   */

  /**
   *
   * @return {string}
   */
  public get id(): string {
    return this._id;
  }

  /**
   *
   * @return {string[]}
   */
  public get members(): Map<string, boolean> {
    return this._members;
  }

  public get npcAttackIntervalMillis(): number {
    throw new Error("Not implemented");
  }

  public get ownId(): string {
    return FirebaseClient.auth.currentUser.uid;
  }

  public get opponentId(): string {
    if (this.members.size < 2) {
      throw new Error("Member isn't fulfilled.");
    }

    let opponentId = null;
    this.members.forEach((value, id) => {
      if (id !== FirebaseClient.auth.currentUser.uid) {
        opponentId = id;
      }
    });

    if (!opponentId) {
      console.error("Got null opponent id!");
    }

    return opponentId;
  }

  /** **********************************************************************************
   * Status change methods
   */

  public join(): Promise<void> {
    const { uid } = FirebaseClient.auth.currentUser;

    const checkGameExistPromise = (gameSnapshot) =>
      new Promise((resolve, reject) => {
        if (gameSnapshot.exists()) {
          resolve();
        } else {
          reject(new Error("no_game"));
        }
      });

    const joinInTransaction = () =>
      this.transaction((current) => {
        if (!current) {
          return current;
        }

        if (!current.members || Object.keys(current.members).length < 2) {
          // eslint-disable-next-line no-param-reassign
          current.members = { ...current.members, [uid]: false };
        }

        return current;
      }, "join_game");

    const checkFulfilledMemberPromise = ({ snapshot }) =>
      new Promise((resolve, reject) => {
        if (snapshot.hasChild(`members/${uid}`)) {
          resolve();
        } else {
          reject(new Error("already_fulfilled"));
        }
      });

    return Promise.resolve()
      .then(() => this._gameRef.once("value"))
      .then(checkGameExistPromise)
      .then(() => this._gameRef.child("members").once("value"))
      .then(joinInTransaction)
      .then(checkFulfilledMemberPromise)
      .then(() => {
        this._gameRef.child("members").on("value", this.onMemberUpdated);
        this._gameRef
          .child("currentRound")
          .on("value", this.onCurrentRoundUpdated);
        this._gameRef.child(`members/${uid}`).onDisconnect().set(null);
      });
  }

  public async remove(): Promise<void> {
    await this.release();
    await this._gameRef.set(null);
  }

  public async leave(): Promise<void> {
    const { uid } = FirebaseClient.auth.currentUser;
    await this._gameRef.child("members").update({
      [uid]: null,
    });
    await this._gameRef.child(`members/${uid}`).onDisconnect().cancel();
  }

  public async requestReady(): Promise<void> {
    const { uid } = FirebaseClient.auth.currentUser;
    await this._gameRef.child("members").update({
      [uid]: true,
    });
  }

  public async start(): Promise<void> {
    const now = firebase.database.ServerValue.TIMESTAMP;
    const members = (await this._gameRef.child("members").once("value")).val();
    await this.transaction((current) => {
      if (current && current.currentRound !== 1) {
        Object.assign(current, {
          members,
          currentRound: 1,
          battles: {},
          updatedAt: now,
        });
      }
      return current;
    }, "start_game");
  }

  public async next(): Promise<void> {
    if (this.currentRound >= this.roundSize) {
      console.error("Round of the game is already fulfilled.");
      return;
    }

    const nextRound = this.currentRound + 1;
    const now = firebase.database.ServerValue.TIMESTAMP;

    await this.transaction((current) => {
      if (current && current.currentRound !== nextRound) {
        // eslint-disable-next-line no-param-reassign
        current.currentRound = nextRound;
        // eslint-disable-next-line no-param-reassign
        current.updatedAt = now;
      }
      return current;
    }, "process_game_round");
  }

  isFixed(): boolean {
    const requiredWins = Math.ceil(this.roundSize / 2);
    const isFixed =
      this.getWins(Actor.PLAYER) >= requiredWins ||
      this.getWins(Actor.OPPONENT) >= requiredWins;

    // TODO replace member status update logic.
    if (isFixed) {
      console.log("Update user state to false. wait to request game restart.");
      const { uid } = FirebaseClient.auth.currentUser;
      this._gameRef.child("members").update({ [uid]: false });
      this._gameRef.child("currentRound").set(null);
    }

    return isFixed;
  }

  public async release(): Promise<void> {
    this.off();

    this._gameRef.child("members").off();
    this._gameRef.child("currentRound").off();

    this._battles.forEach((battle: OnlineBattle) => {
      battle.release();
    });
    this._battles.clear();
  }

  /** **********************************************************************************
   * Callback methods
   */

  /**
   *
   * @param {firebase.database.DataSnapshot} snapshot
   */
  protected onMemberUpdated = (
    snapshot: firebase.database.DataSnapshot
  ): void => {
    if (!snapshot.exists()) {
      return;
    }

    const prevMembers = new Map(this.members);

    // Update local members status.
    this.members.clear();
    snapshot.forEach((child) => {
      this.members.set(child.key, child.val());
      return false; // Keep enumeration
    });

    const currentMembers = new Map(this.members);

    console.log(
      "Received updated members. prev: ",
      prevMembers,
      "current: ",
      currentMembers
    );

    // Leave from the game?
    if (prevMembers.size === 2 && currentMembers.size !== 2) {
      console.log("Member left.");
      this.dispatch(GameEvents.MEMBER_LEFT);
    }

    // Got fulfilled?
    if (prevMembers.size !== 2 && currentMembers.size === 2) {
      console.log(`Game members are fulfilled.`);
      this.dispatch(GameEvents.FULFILLED_MEMBERS);

      // After fulfilled, this game resource remove event is member left.
      this._gameRef.onDisconnect().cancel();

      // Set disconnect event.
      const opponentConnectingRef = FirebaseClient.database.ref(
        `/oimo-no-mikiri/users/${this.opponentId}/isConnecting`
      );
      opponentConnectingRef.on(
        "value",
        (snap: firebase.database.DataSnapshot) => {
          if (snap.exists() && !snap.val()) {
            this.dispatch(GameEvents.MEMBER_LEFT);
          }
        }
      );
    }

    // Received to request game start?
    this.members.forEach((isReady, uid) => {
      const isPrevMemberReady = prevMembers.get(uid);
      if (isUndefined(isPrevMemberReady)) {
        return;
      }

      if (!isPrevMemberReady && isReady) {
        console.log(`Request starting game by ${uid}`);
        this.dispatch(GameEvents.REQUESTED_START, uid);
      }
    });

    // Is every member ready?
    if (
      currentMembers.size === 2 &&
      Array.from(currentMembers.values()).every((isReady) => isReady)
    ) {
      this.dispatch(GameEvents.IS_READY);
    }
  };

  protected onCurrentRoundUpdated = async (
    snapshot: firebase.database.DataSnapshot
  ): Promise<void> => {
    if (!snapshot.exists()) {
      return;
    }

    const prevRound = this._currentRound;
    const nextRound = snapshot.val();
    const nextBattle = new OnlineBattle({
      gameId: this._id,
      round: nextRound,
      playerId: this.ownId,
      opponentId: this.opponentId,
    });

    if (nextRound === 1) {
      this._battles.clear();
    }

    this._battles.set(nextRound, nextBattle);
    this._currentRound = nextRound;

    await nextBattle.start();

    console.log(
      `Proceed to next round. Round${prevRound} -> Round${nextRound}`
    );
    this.dispatch(GameEvents.ROUND_PROCEED, { nextRound });
  };

  /** **********************************************************************************
   * Private methods
   */

  /**
   *
   */
  private async transaction(
    // eslint-disable-next-line
    transactionUpdate: (current: any) => any,
    tag?: string
  ): Promise<{ committed: boolean; snapshot: firebase.database.DataSnapshot }> {
    console.log(`Start transaction. TAG: ${tag}`);
    const { committed, snapshot } = await this._gameRef.transaction(
      transactionUpdate
    );
    console.log(
      `End transaction. TAG: ${tag}, committed: ${committed}`,
      snapshot.val()
    );

    return { committed, snapshot };
  }
}

export default OnlineGame;
