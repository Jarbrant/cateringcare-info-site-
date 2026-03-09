/**
 simple analytics
 stores asked questions
*/

import fs from "fs";

const LOG = "questions.log";

export function logQuestion(question:string){

 fs.appendFileSync(LOG, question + "\n");

}
