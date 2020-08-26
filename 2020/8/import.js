import { a } from "./export.js";
// a会跟随a文件的变化
setInterval(() => {
  console.log(a);
}, 500);