const request = require('request');
const qs = require('querystring');
const TITLE=process.env.TITLE;
const KEY =process.env.KEY; //Input API-KEY to Header
//const KEY="U9G1L457H6DCugT7VmBaEacbHV9RX0PySO05cYaGsm";
const URL =process.env.URL; //Input URL for Request
//const URL="https://iapi.bot.or.th/Stat/Stat-ReferenceRate/DAILY_REF_RATE_V1/?";
//const TOKEN = 'EIeqyillzkzpaCo1ROrebZTcGbIyzDZHpOjcdd0t6CX';
const TOKEN=process.env.TOKEN; //Input TOKEN LINE 
//Set Date
var dateFormat = require('dateformat');
var daynow = new Date(); // Today!
daynow.setDate(daynow.getDate() - 1); // Yesterday!
var daynow=dateFormat(daynow, "yyyy-mm-dd");
var DAYSTARTPERIOD=daynow;
var DAYENDPERIOD=daynow;
//Set Date
var stickerPkg=2; //stickerPackageId
var stickerId=161; //stickerId
var Message="";
//Setup QueryString
var querystring = qs.stringify({
    start_period: DAYSTARTPERIOD,
    end_period: DAYENDPERIOD
});
//Setup QueryString
function callback(error, response, body) {
  //console.log(URL+querystring);
  //console.log('Response Code: '+ response.statusCode);
  //console.log(body)
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    if(info.result.success=="true"){
         //console.log(info.result.data.data_header.report_name_th + " Report Name");
         //console.log(info.result.data.data_detail[0].rate + " Rate");
        Message+="TITLE:"+TITLE+"\n===Report from BOT API===\nReport Name:"+info.result.data.data_header.report_name_eng+"\nReport Source:"+info.result.data.data_header.report_source_of_data[0].source_of_data_eng+"\nData:"+info.result.data.data_detail[0].rate+" THD/USD"+"\nLast Update Timestamp:"+info.result.timestamp+"\nRemark:"+info.result.api;
       // console.log(imageFile);
        //Send Message
        request({
          method: 'POST',
          uri: 'https://notify-api.line.me/api/notify',
          headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
          'auth': {
                  'bearer': TOKEN
                  },
          form: {
                  stickerPackageId:stickerPkg,
                  stickerId:stickerId,
                  message: Message
                  }
                  }, (err,httpResponse,body) => {
                                                      console.log(JSON.stringify(err));
                                                      console.log(JSON.stringify(httpResponse));
                                                      console.log(JSON.stringify(body));
                                                      })
        //Send Message
        }
    else{console.log("error");
    }
  }
}
 var options = 
  {
  url: URL+querystring,
  headers: {
    'api-key': KEY
            }
  };
  request(options, callback)
/*
{"result":
  {"success":"true","api":"Daily Weighted-average Interbank Exchange Rate - THB / USD","timestamp":"2017-07-22 10:42:59",
    "data":{"data_header":
            {
              "report_name_eng":"Rates of Exchange of Commercial Banks in Bangkok Metropolis (2002-present)",
              "report_name_th":"อัตราแลกเปลี่ยนเฉลี่ยของธนาคารพาณิชย์ในกรุงเทพมหานคร (2545-ปัจจุบัน)"
              ,"report_uoq_name_eng":"(Unit : Baht / 1 Unit of Foreign Currency)"
              ,"report_uoq_name_th":"(หน่วย : บาท ต่อ 1 หน่วยเงินตราต่างประเทศ)"
              ,"report_source_of_data":
                [{"source_of_data_eng":"Bank of Thailand","source_of_data_th":"ธนาคารแห่งประเทศไทย"}]
                ,"report_remark":[],"last_updated":"2017-07-21"
            },
              "data_detail":[{"period":"2017-07-21","rate":"33.5080000"}]}}}
*/