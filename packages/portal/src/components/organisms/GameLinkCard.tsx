import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import {
  Card,
  CardActions,
  CardContent,
  Dialog,
  Button,
  Typography,
  CardMedia,
} from "@material-ui/core";

export interface GameLinkCardProps {
  open: boolean;
  title: string;
  description: string;
  gameUrl: string;
  imageUrl: string;
  onClose: () => void;
}

const GameLinkCard: FC<GameLinkCardProps> = (props) => {
  const { open, title, description, gameUrl, imageUrl, onClose } = props;
  const { t } = useTranslation();

  const onClickJumpGame = () => {
    location.assign(gameUrl);
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth={"xs"}>
        <Card>
          <CardMedia
            component="img"
            height="300"
            image={imageUrl}
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography component="h5" variant="h5">
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {description}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <Button size="small" color="default" onClick={onClose}>
              {t(`game_link_card.close`)}
            </Button>
            <Button size="small" color="primary" onClick={onClickJumpGame}>
              {t(`game_link_card.jump_to_game`)}
            </Button>
          </CardActions>
        </Card>
      </Dialog>
    </div>
  );
};

export default GameLinkCard;
