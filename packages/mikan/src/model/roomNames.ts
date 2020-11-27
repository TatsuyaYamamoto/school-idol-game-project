export function getRandomRoomName(suffix: number = 0) {
  const min = 0;
  const max = candidates.length - 1;
  const index = Math.floor(Math.random() * (max + 1 - min)) + min;

  const prefix = candidates[index];
  return `${prefix}-${suffix}`;
}

const candidates = [
  // honoka
  "take",

  // eri
  "ouchi",

  // kotori
  "cure",

  // umi
  "iba",

  // rin
  "okujo",

  // maki
  "danro",

  // nozomi
  "kanda",

  // hanayo
  "ohgon",

  // nico
  "super",

  // chika
  "yasuda",

  // riko
  "noriba",

  // kanan
  "kaeru",

  // dia
  "kaigan",

  // you
  "mitosee",

  // yoshiko
  "jishitsu",

  // hanamaru
  "tera",

  // mari
  "awashima",

  // ruby
  "shinkai",
];
