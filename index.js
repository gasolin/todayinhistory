// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const {
  dialogflow,
  Suggestions,
  BasicCard,
  Button,
  SimpleResponse
} = require('actions-on-google');
 
//process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

// refer https://zh.wikipedia.org/wiki/Wikipedia:%E5%8E%86%E5%8F%B2%E4%B8%8A%E7%9A%84%E4%BB%8A%E5%A4%A9
var events = {
  '0406': [
    '1896年：第一屆奧林匹克運動會（圖）在希臘雅典的帕那辛奈克體育場開幕，共有來自14個國家的241名運動員參與43種競賽項目。',
    '2004年：日本已故漫畫家臼井儀人的代表作蠟筆小新中的背景舞台春日部市，主人公的野原一家被予為春日部市的榮譽市民。',
  ],
  '0407': [
    '1948年：《世界衛生組織組織法》正式生效，聯合國旗下管理公共衛生的世界衛生組織宣告成立。'
  ],
  '0408': [
    '1904年：美國紐約曼哈頓的朗埃克廣場因為《紐約時報》總部大樓遷至附近而改名為時報廣場。',
    '1913年：巴西宣布承認中華民國，成為世界第一個承認中華民國的國家。',
  ],
  '0409': [
    '1967年：美國波音公司研發的波音737客機首次試飛，後來成為民航噴射客機史上最為廣泛使用的機種。',
    '2003年：美伊戰爭聯軍占領巴格達，薩達姆·海珊的政權解體。',
  ],
  '0410': [
    '1930年：台灣嘉南大圳通水啟用。',
    '1959年：日本皇太子明仁與美智子結婚，明仁成為首位迎娶平民的日本皇太子。',
  ],
  '0411': [
    '1909年：由66個猶太人家庭組成的住宅營造協會在雅法北面購買並分配土地，之後在此建立新城市特拉維夫。',
    '2009年：蘇珊大嬸（Susan Magdalane Boyle）參加第三季的英國達人競賽而受到大眾的注意。'
  ],
  '0412': [
    '1927年：中國國民黨在蔣中正命令下開始在上海市對中國共產黨成員展開大規模逮捕和處死，之後促成第一次國共內戰爆發。',
    '1981年：美國哥倫比亞號太空梭自佛羅里達州甘迺迪航天中心首次發射升空（圖），這也是世界上第一架正式服役的太空梭。'
  ],
  '0413': [
    '1742年：德國巴洛克音樂作曲家格奧爾格·弗里德里希·韓德爾（圖）創作的神劇《彌賽亞》在愛爾蘭都柏林首演。'
  ],
  '0414': [
    '1865年：美國總統亞伯拉罕·林肯在華盛頓哥倫比亞特區福特劇院觀劇時遭到美利堅邦聯支持者約翰·威爾克斯·布思刺殺，隔天凌晨身亡。',
    '1912年：英國奧林匹亞級郵輪鐵達尼號在處女航時於大西洋撞上冰山後沉沒（圖），造成至少1,490人死亡。'
  ],
  '0415': [
    '1755年：英國文學家塞繆爾·詹森編撰的《詹森字典》出版，成為第一部正式的英文辭典。',
    '1995年：124個國家和歐洲共同體代表在摩洛哥馬拉喀什召開的部長級會議上簽署馬拉喀什協定，從而建立世界貿易組織'
  ],
  '0416': [
    '1853年：國營的印度鐵路公司成功開通連接孟買到塔那的鐵路客運服務，之後該鐵路系統成為世界上最大的鐵路網路之一。',
    '1947年：美國總統顧問暨金融家伯納德·巴魯克於南卡羅來納州的一場演講中，將第二次世界大戰後美國與蘇聯間的緊張關係稱作「冷戰」。',
    '2007年：位於美國維吉尼亞州黑堡的維吉尼亞理工學院暨州立大學發生校園槍擊案（圖），最後包括槍手趙承熙在內共33人死亡以及20多人受傷。',
    '2014年：韓國客輪「世越號」自仁川港航向濟州島途中翻覆沉沒，造成295人死亡、172人受傷。'
  ],
  '0417': [
    '1895年：清朝和大日本帝國代表在日本下關市簽訂《馬關條約》（圖）以結束甲午戰爭，最終將臺灣和遼東半島割讓給日本。',
    '1951年：主要位於英格蘭德比郡的峰區正式劃為國家公園，這也是英國第一座國家公園。',
    '1973年：由弗雷德里克·W·史密斯所創辦的聯邦快遞在總部遷往田納西州後，開始為25個城市提供遞送包裹的服務。'
  ],
  '0418': [
    '1938年：美國作家傑里·西格爾和藝術家喬·舒斯特創作的超人在《動作漫畫》中首次登場，成為第一部真正意義上的超級英雄漫畫。',
    '1949年：愛爾蘭共和國依照1948年愛爾蘭共和國法案宣布成為一個獨立國家，並且自動脫離大英國協。'
  ],
  '0419': [
    '1775年：北美殖民地的民兵和前來解除其武裝的英國軍隊在馬薩諸塞灣省列星頓發生武裝衝突，美國獨立戰爭爆發。',
    '1965年：英特爾創始人之一戈登·摩爾在《電子學》雜誌（Electronics Magazine）發表了摩爾定律',
    '1971年：蘇聯用質子號運載火箭將世界上首個太空站禮炮1號送上太空。',
  ],
  '0420': [
    '1862年：法國化學家暨微生物學家路易·巴士德和生理學家克洛德·貝爾納完成了首次巴士德消毒法的測試。',
    '1912年：位於美國麻薩諸塞州首府波士頓的芬威球場正式啟用，成為現今美國職棒大聯盟所使用最古老的棒球場。'
  ],
  '0421': [
    '1949年：中國人民解放軍發起渡江戰役強行渡過長江，突破中華民國國軍所設下的長江防線。',
    '1960年：巴西政府為盧西奧·科斯塔設計的新首都巴西利亞舉行落成儀式，正式將巴西首都從里約熱內盧遷往巴西利亞。'
  ],
  '0422': [
    '1911年：清朝政府以美國退回的部分義和團運動庚子賠款作為資金，創辦了後來在中國大陸發展成為重要大學之一的清華大學',
    '1998年：佔地超過500英畝的迪士尼動物王國在美國佛羅里達州的華特迪士尼世界度假區正式營運開業，成為華特迪士尼樂園及度假區最大的單一主題公園。'
  ],
  '0423': [
    '2005年：第一部YouTube影片上傳，標題為「我在動物園」（Me at the zoo',
    '2008年：賽德克族於2008年4月23日正式成為第十四個台灣原住民族。'
  ],
  '0424': [
    '1898年：西班牙向美國宣戰，美西戰爭正式爆發。',
    '1981年：IBM推出首部個人電腦。',
  ],
  '0425': [
    '1644年：明朝皇帝明思宗因李自成率領的農民軍攻入北京而被迫在景山自縊，明朝滅亡。',
    '1964年：坦干伊喀和桑吉巴兩個非洲東部國家合併成坦尚尼亞，並且由朱利葉斯·尼雷爾擔任首屆總統。',
    '1986年：烏克蘭車諾比核能電廠發生蒸氣爆炸並引發核泄漏事故，最後迫使超過336,000名歐洲各地民眾必須疏散與遷徙。'
  ],
  '0426': [
    '1994年：南非舉行首次不分種族的全國大選，南非非洲人國民大會贏得大選。',
    '2018年：菲律賓熱門景點長灘島，因商業污染，將封島半年。',
  ],
  '0427': [
    '1997年：橫跨香港青衣島和馬灣，連接大嶼山赤鱲角，全球最長的公路鐵路雙用懸索吊橋—青馬大橋落成。',
    '2005年：全球載客量最高的客機空中巴士A380首航',
  ],
  '0428': [
    '1952年：同盟國各國與日本簽訂的《舊金山和約》正式生效，結束同盟國軍事佔領日本並且要求日本承認朝鮮半島獨立。',
    '2001年：美國商人丹尼斯·蒂托乘坐俄羅斯聯盟TM-32宇宙飛船前往國際太空站，成為世界首位太空遊客。',
    '2003年：蘋果電腦的iTunes音樂商店開放，在首周賣出1,000,000首歌曲。',
  ],
  '0429': [
    '1997年：1993年簽署的《禁止化學武器公約》正式生效，旨在禁止締約國發展、生產、儲存和使用化學武器。',
    '2011年：全世界3億多名電視觀眾觀看英國劍橋公爵威廉王子和凱薩琳在倫敦西敏寺所舉辦的婚禮。'
  ],
  '0430': [
    '1872年：中國第一張近代報紙《申報》在上海創刊。',
    '1993年：網際網路的雛形在歐洲核子研究組織形成。'
  ],
};
var today = '';
var items = [];

// Create an app instance
const app = dialogflow({
  debug: false,
  //init: () => {}
});

const fallback = agent => {
    agent.add(`\n 請試著問問看: 歷史上的今天`);
    agent.add(new Suggestions(`歷史上的今天`));
};

app.intent('Default Welcome Intent', fallback);
app.intent('Default Fallback Intent', fallback);
app.intent('actions.intent.DATETIME', fallback);

app.intent('TodayInHistoryIntent', (agent, { date: rawdate }) => {
  let [, month, date] = rawdate.split('T')[0].split('-');
    let timedex = `${month}${date}`;
    //console.log('Current timedex ', timedex);
    if (today !== timedex) {
      today = timedex;
      items = events[today];
    }
    if (items) {
      const msg = `歷史上的${parseInt(month, 10)}月${parseInt(date, 10)}日，${items[Math.floor(Math.random()*items.length)]}`;
      agent.close(msg);
      /*agent.ask(new BasicCard({
        title: `歷史上的${parseInt(month, 10)}月${parseInt(date, 10)}日`,
        formattedText: `${items[Math.floor(Math.random()*items.length)]}`,
        buttons: new Button({
          title: '查看更多',
          url: `https://zh.wikipedia.org/wiki/${parseInt(month, 10)}%E6%9C%88${parseInt(date, 10)}%E6%97%A5`,
    	}),
      }));*/
    } else {
      const msgFail = `抱歉，目前尚未提供${parseInt(month, 10)}月${parseInt(date, 10)}日的歷史資料`;
      agent.ask(msgFail);
      agent.ask(new Suggestions(`歷史上的今天`));
    }
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
