import Color from 'color';

export const TEMP_COLORS = {
  heat: '#FEC205',
  mid: '#31B56F',
  cool: '#2D99D4',
  night: '#0D65A7',
};

const COLORS = {
  0: ['#9FB2C1', '#627B8A'],
  5: ['#409674', '#3F868B'],
  6: ['#3D9973', '#3F8989'],
  7: ['#3A9C72', '#408B86'],
  8: ['#379F71', '#408D83'],
  9: ['#34A36F', '#408F81'],
  10: ['#2FA76D', '#40917D'],
  11: ['#2AAA6A', '#409479'],
  12: ['#23AD66', '#409673'],
  13: ['#2AB169', '#3D9973'],
  14: ['#30B46C', '#3A9C72'],
  15: ['#36B86F', '#37A071'],
  16: ['#3CBC72', '#33A46F'],
  17: ['#42BF75', '#2FA76D'],
  18: ['#47C378', '#29AA6A'],
  19: ['#FDD02F', '#FDB92C'],
  20: ['#FDC830', '#FDAB29'],
  21: ['#FDC12E', '#FC9C27'],
  22: ['#FDB92C', '#FD8C25'],
  23: ['#FCAB29', '#FB7D23'],
  24: ['#FC9C27', '#FA6B21'],
  25: ['#FC8C25', '#FC541F'],
};

export const getGradient = t =>
  t === 0 ? COLORS[t] : COLORS[Math.max(5, Math.min(25, t))];

export const getPrimaryColor = t => getGradient(t)[0];
export const getSecondaryColor = t => getGradient(t)[1];

export const getMidColor = t => {
  const a = Color(getPrimaryColor(t)).array();
  const b = Color(getSecondaryColor(t)).array();

  return Color.rgb(a.map((x, i) => (x + b[i]) / 2)).string();
};
