const url =
  "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$";

const email = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
const urlPattern = new RegExp(url);
const emailPattern = new RegExp(email);

export const isEmail = (item) => !!emailPattern.test(item);
export const isUrl = (item) => !!urlPattern.test(item);
