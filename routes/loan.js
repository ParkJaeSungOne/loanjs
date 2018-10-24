var express = require('express');
var router = express.Router();

router.get("/", function(req, res){
  res.render("loan/index");
});

router.post("/calc", function(req, res){
  // 대출금액
  var loan_money = req.body.loan_money;
  // 대출금리
  var loan_rate = req.body.loan_rate;
  // 대출기간
  var loan_period = req.body.loan_period;
  // 거치기간
  var leaving_period = req.body.leaving_period;
  // 상환방식
  var repay_way = req.body.repay_way;

  var repay_way_name;
  if(repay_way == "1"){
    repay_way_name = "원리금 균등상환";
  }else if(repay_way == "2"){
    repay_way_name = "원금 균등 상환";
  }else{
    repay_way_name = "원금 만기 일시 상환";
  }

  var jsonData = calc_loan(loan_money, loan_rate, loan_period, leaving_period, repay_way);

  res.render("loan/calc", {jsonDatas : jsonData, loan_money : comma(loan_money), loan_rate : comma(loan_rate), loan_period : loan_period, leaving_period : leaving_period, repay_way_name : repay_way_name});
});

function comma(str) {
  str = String(str);
  return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

// 대출이자 계산
function calc_loan(loan_money, loan_rate, loan_period, leaving_period, repay_way){

  var calc_list;

  var data;
  // 이자
  var interest_money = 0;
  // 상환금
  var calc = 0;
  // 납입원금
  var origin_money = 0;
  // 납입원금계
  var sum_origin_money = 0;
  // 대출잔금
  var loan_remaining_money = 0;

  var i;

  var jsonData;

  var origin_loan_period = loan_period;

  var sum_interest_money = 0;

  // 원리금 균등상환 계산 (1)
  if(repay_way == "1"){
    // 대출잔금
    loan_remaining_money = loan_money;
    calc_list = new Array([]);

    for(i = 1; i <= origin_loan_period; i++){
      // 상환금
      calc = (loan_money * ((loan_rate / 12) / 100) * Math.pow((1 + ((loan_rate / 12) / 100)), loan_period) / ((Math.pow(1 + ((loan_rate / 12) / 100), loan_period) - 1)));

      data = new Object({});
      //이자
      interest_money = loan_remaining_money * ((loan_rate / 12) / 100);
      // 납입원금
      origin_money = calc - interest_money;
      // 대출 잔금
      loan_remaining_money = loan_remaining_money - origin_money;
      // 납입원금계
      sum_origin_money = sum_origin_money + origin_money;

      if(leaving_period != "0"){
        origin_money = 0;
        loan_remaining_money = loan_money;
        sum_origin_money = 0;
        leaving_period = Number(leaving_period) - 1;
        calc = interest_money;
        loan_period = Number(loan_period) - 1;
      }

      // 총이자
      sum_interest_money = Number(sum_interest_money) + Number(interest_money);

      // 회차
      data.num = i;
      // 상환금
      data.calc = comma(Math.round(calc));
      // 납입원금
      data.origin_money = comma(Math.round(origin_money));
      // 이자
      data.interest_money = comma(Math.round(interest_money));
      // 납입원금계
      data.sum_origin_money = comma(Math.round(sum_origin_money));
      // 잔금
      data.loan_remaining_money = comma(Math.round(loan_remaining_money));
      // 총이자
      data.sum_interest_money = comma(Math.round(sum_interest_money));

      calc_list.push(data);
   }
   jsonData = JSON.stringify(calc_list);
   return jsonData ;
  }
  // 원금 균등 상환 (2)
  else if(repay_way == "2"){

    calc_list = new Array([]);
    // 대출원금
    loan_remaining_money = loan_money;

    for(i = 1; i <= origin_loan_period; i++){
     // 납입원금
     origin_money = loan_money / loan_period;


      data = new Object({});
      // 연이자율
      // ((loan_rate / 12) / 100)
      // 이자금액
      interest_money = loan_remaining_money * ((loan_rate / 12) / 100);
      // 대출원금
      loan_remaining_money = loan_remaining_money - origin_money;
      // 납입원금계
      sum_origin_money = sum_origin_money + origin_money;
      // 상환금
      calc = origin_money + interest_money;

      if(leaving_period != "0"){
        origin_money = 0;
        loan_remaining_money = loan_money;
        sum_origin_money = 0;
        leaving_period = Number(leaving_period) - 1;
        calc = interest_money;
        loan_period = Number(loan_period) - 1;
      }
      // 총이자
      sum_interest_money = Number(sum_interest_money) + Number(interest_money);

      // 회차
      data.num = i;
      // 상환금
      data.calc = comma(Math.round(calc));
      // 납입원금
      data.origin_money = comma(Math.round(origin_money));
      // 이자
      data.interest_money = comma(Math.round(interest_money));
      // 납입원금계
      data.sum_origin_money = comma(Math.round(sum_origin_money));
      // 잔금
      data.loan_remaining_money = comma(Math.round(loan_remaining_money));
      // 총이자
      data.sum_interest_money = comma(Math.round(sum_interest_money));

      calc_list.push(data);
    }
    jsonData = JSON.stringify(calc_list);

    return jsonData;
  }
  // 원금 만기 일시 상환 (3)
  else if(repay_way == "3"){
    calc_list = new Array([]);

    // 이자
    interest_money = loan_money * ((loan_rate / 12) / 100);

    for(i = 1; i <= loan_period; i++){
      data = new Object({});

      calc = interest_money;
      loan_remaining_money = loan_money;
      if(i == loan_period){
          calc = Number(loan_money) + Number(interest_money) ;
          origin_money = loan_money;
          sum_origin_money = loan_money;
          loan_remaining_money = 0;
      }

      // 총이자
      sum_interest_money = Number(sum_interest_money) + Number(interest_money);

      // 회차
      data.num = i;
      // 상환금
      data.calc = comma(Math.round(calc));
      // 납입원금
      data.origin_money = comma(Math.round(origin_money));
      // 이자
      data.interest_money = comma(Math.round(interest_money));
      // 납입원금계
      data.sum_origin_money = comma(Math.round(sum_origin_money));
      // 잔금
      data.loan_remaining_money = comma(Math.round(loan_remaining_money));
      // 총이자
      data.sum_interest_money = comma(Math.round(sum_interest_money));

      calc_list.push(data);
    }
    jsonData = JSON.stringify(calc_list);

    return jsonData;
  }else{
    console.log("오류 !!");
    return;
  }
}

module.exports = router;
