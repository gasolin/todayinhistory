// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
//process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

// refer https://zh.wikipedia.org/wiki/%E5%8E%86%E5%8F%B2%E4%B8%8A%E7%9A%84%E4%BB%8A%E5%A4%A9
var events = {
  '0302': [
    '2009年：幾內亞比索總統維埃拉在該國首都比紹的軍事政變中遭叛變士兵槍殺中彈身亡。',
    '2016年：印尼蘇門答臘島發生8.1級地震。',
    '2017年：桃園機場捷運正式通車。',
  ],
  '0303': [
    '2005年：美國冒險家詹姆斯·史蒂芬·福塞特駕駛試驗性嘅「環球飛行者」號噴氣式飛機完成世界上第一次一個人揸飛機完成無間斷環球飛行。',
    '2006年：首屆世界棒球經典賽A組預賽在日本東京巨蛋開打。',
    '2009年：斯里蘭卡國家板球隊在巴基斯坦旁遮普省首府拉合爾遭遇恐怖襲擊，造成護送球隊的6名警察和2名平民死亡，6名球員受傷。',
    '2011年：蘋果公司在舊金山芳草地藝術中心發布iPad 2和iOS 4.3。',
  ],
  '0304': [
    '2009年：國際刑事法院以涉嫌在達佛衝突犯有戰爭罪和反人類罪為由，對蘇丹總統奧馬爾·巴希爾發出逮捕令。',
    '2010年：墨西哥首都墨西哥城正式承認同性婚姻合法，開創了拉美地區的先河。',
    '2012年：俄羅斯總統大選',
    '2011年：中華民國法務部長曾勇夫簽署死刑執行令，於法務部矯正署台北監獄刑場槍決管鐘演和鍾德樹二名死刑犯，於法務部矯正署台中監獄刑場槍決王志煌一名死刑犯，於法務部矯正署高雄第二監獄刑場槍決莊天祝和王國華二名死刑犯，一共於三處刑場槍決五名死刑犯。',
  ],
  '0305': [
    '2006年：第78屆奧斯卡金像獎頒獎典禮舉行。',
    '2013年：朝鮮單方面宣布於1953年簽訂的《朝鮮停戰協定》將於同年3月11日完全無效，並中斷板門店朝美軍事熱線。',
  ],
  '0306': [
    '2003年：香港美孚新邨一間銀行發生人肉炸彈案。',
    '2011年：香港爆發反財政預算案大遊行，有示威者堵塞德輔道中，當中113名被捕，是繼六七暴動後捕獲最多人的一次。',
  ],
  '0307': [
    '2008年：中國南方航空6901號班機（波音757）遭遇爆炸未遂，備降蘭州中川機場，無人傷亡。',
    '2015年：馬來西亞反對派支持者因不滿法庭判安華監禁5年而發動307集會，越有上千名集會者，最終在首都吉隆坡地標雙峰塔結束短短4小時的集會。',
  ],
  '0308': [
    '2008年：2008年馬來西亞第十二屆全國大選，執政聯盟國陣再度執政馬來西亞下議院，但是卻在本屆大選中失去五個州政權和三分之二席位的優勢。',
    '2013年：朝鮮祖國和平統一委員會宣布將全面廢除朝韓之間簽訂的互不侵犯協議，切斷南北韓熱線電話等板門店聯絡渠道。',
    '2014年：馬來西亞航空370號班機在執行由吉隆坡國際機場飛往北京首都國際機場航線時於馬來西亞當地時間凌晨1時21分在馬來西亞與越南的航空管制區內失去與塔台的聯繫，之後該機折返回馬來西亞，並在馬來西亞霹靂島上空失去衛星聯絡訊號，至今下落不明。',
  ],
  '0309': [
    '2008年：台灣第二條捷運系統高雄捷運紅線通車。',
  ],
  '0310': [
    '2004年：利比亞在維也納與國際原子能總署正式簽署了《不擴散核武器條約》的附加議定書，允許該機構的核查人員對其境內的所有核設施進行突擊式檢查。',
    '2005年：香港特首董建華宣布辭職。',
    '2011年：中國雲南省德宏傣族景頗族自治州盈江縣當地時間12時58分（UTC+8），發生芮氏5.8級地震，震中位於北緯24.7度，東經97.9度，震源深度約10公里。',
    '2017年：韓國總統朴槿惠遭彈劾下台。',
  ]
};
var today = '';
var items = [];

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  //console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  //console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
  function fallback(agent) {
    agent.add(`\n請試著問問看: 歷史上的今天`);
    agent.add(new Suggestion(`歷史上的今天`));
  }


  function googleAssistantHandler(agent) {
    //let conv = agent.conv(); // Get Actions on Google library conv instance
    let [, month, date] = agent.parameters.date.split('T')[0].split('-');
    let timedex = `${month}${date}`;
    console.log('Current timedex ', timedex);
    if (today !== timedex) {
      today = timedex;
      items = events[today];
    }
    if (items) {
      agent.add(`歷史上的${parseInt(month, 10)}月${parseInt(date, 10)}日，${items[Math.floor(Math.random()*items.length)]}`); // Use Actions on Google library
      //conv.close('bye');
      //agent.add(conv); // Add Actions on Google library responses to your agent's response
    } else {
      agent.add(`抱歉，目前尚未提供${parseInt(month, 10)}月${parseInt(date, 10)}日的歷史資料`);
      agent.add(new Suggestion(`歷史上的今天`));
    }
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('TodayInHistoryIntent', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
