const Database=require("better-sqlite3");
const path=require("path"),fs=require("fs");
const dir=path.join(__dirname,"..","data");fs.mkdirSync(dir,{recursive:true});
const db=new Database(path.join(dir,"amzbb.sqlite"));db.pragma("journal_mode=WAL");
db.exec(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,telegram_id TEXT UNIQUE,name TEXT,username TEXT,balance REAL DEFAULT 0,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS wallet_ledger(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER,type TEXT,amount REAL,reference TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER,status TEXT DEFAULT 'PENDING',total REAL,items_json TEXT,note TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS bulk_orders(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER,payload TEXT,status TEXT DEFAULT 'QUEUED',created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS coupons(code TEXT PRIMARY KEY,type TEXT,value REAL,min_amount REAL DEFAULT 0,active INTEGER DEFAULT 1);
CREATE TABLE IF NOT EXISTS payments(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER,razorpay_order_id TEXT UNIQUE,razorpay_payment_id TEXT,amount REAL,status TEXT DEFAULT 'CREATED',created_at TEXT DEFAULT CURRENT_TIMESTAMP);`);
if(db.prepare("SELECT COUNT(*) c FROM coupons").get().c===0){
 db.prepare("INSERT INTO coupons VALUES(?,?,?,?,1)").run("AMZ10","percent",10,199);
 db.prepare("INSERT INTO coupons VALUES(?,?,?,?,1)").run("SAVE50","flat",50,499);
}
function user(tid,name="Web User",username=""){let u=db.prepare("SELECT * FROM users WHERE telegram_id=?").get(String(tid));if(!u){db.prepare("INSERT INTO users(telegram_id,name,username) VALUES(?,?,?)").run(String(tid),name,username);u=db.prepare("SELECT * FROM users WHERE telegram_id=?").get(String(tid));}return u}
function addLedger(uid,type,amount,ref=""){db.transaction(()=>{db.prepare("UPDATE users SET balance=balance+? WHERE id=?").run(amount,uid);db.prepare("INSERT INTO wallet_ledger(user_id,type,amount,reference) VALUES(?,?,?,?)").run(uid,type,amount,ref)})()}
function order(uid,total,items,note=""){return db.transaction(()=>{const u=db.prepare("SELECT * FROM users WHERE id=?").get(uid);if(!u||u.balance<total)throw Error("INSUFFICIENT_BALANCE");db.prepare("UPDATE users SET balance=balance-? WHERE id=?").run(total,uid);const r=db.prepare("INSERT INTO orders(user_id,total,items_json,note) VALUES(?,?,?,?)").run(uid,total,JSON.stringify(items),note);db.prepare("INSERT INTO wallet_ledger(user_id,type,amount,reference) VALUES(?,?,?,?)").run(uid,"ORDER",-total,"order:"+r.lastInsertRowid);return r.lastInsertRowid})()}
module.exports={db,user,addLedger,order};
