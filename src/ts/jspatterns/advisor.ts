/// <reference path="../../d.ts/AOP.d.ts" />
//768067065aa104200ec373671da88ab5bfd52964
// async function af(n) {
//     let r1 = await (() => {
//         return ++n;
//     });
//     let r2 = await (r1 => {
//         return n = r1() * 10;
//     });
//     let r = r2(r1);
//     return r;
// }
// let p = af(1);
// setTimeout(()=>console.log(p),10);
// new Promise(1)