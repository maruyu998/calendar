import mongoose from 'mongoose';

// export const DateRecord = mongoose.model('DateRecord',
//     (()=>{
//         const schema = new mongoose.Schema({
//             user: {
//                 type: String,
//                 require: true
//             },
//             date: {
//                 type: Date,
//                 require: true
//             },
//             calendar: {
//                 type: String,
//                 require: true
//             }
//         }, {
//             timestamps: true
//         })
//         schema.index({ user: 1, date: 1, calendar: 1 }, {unique: true})
//         return schema
//     })()
// );

// export const UpdateRecord = mongoose.model('UpdateRecord',
//     (()=>{
//         const schema = new mongoose.Schema({
//             user: {
//                 type: String,
//                 require: true
//             },
//             date: {
//                 type: Date,
//                 require: true
//             },
//             calendar: {
//                 type: String,
//                 require: true
//             },
//             next_page_token: {
//                 type: String,
//                 default: null
//             }
//         }, {
//             timestamps: true
//         })
//         schema.index({ user: 1, calendar: 1 }, {unique: true})
//         return schema
//     })()
// )

// export const Lock = mongoose.model('Lock',
//     new mongoose.Schema({
//         collection_name: {
//             type: String,
//             required: true,
//             unique: true
//         },
//         is_lock: {
//             type: Boolean,
//             required: true
//         }
//     })
// )

// export async function isLock(collection_name:string):Promise<boolean>{
//     const lock = await Lock.findOne({collection_name}).exec()
//     if(!lock){
//         await new Lock({collection_name, is_lock:false}).save()
//         return false
//     }else{
//         return lock.is_lock
//     }
// }

// export async function lock(collection_name:string):Promise<boolean>{
//     if(await isLock(collection_name)){
//         return false
//     }
//     await Lock.findOneAndUpdate({collection_name},{$set:{is_lock:false}},{upsert:false,new:false}).exec()
//     return true
// }

// export async function unlock(collection_name:string):Promise<boolean>{
//     if(!(await isLock(collection_name))){
//         return false
//     }
//     await Lock.findOneAndUpdate({collection_name},{$set:{is_lock:false}},{upsert:false,new:false}).exec()
//     return true
// }