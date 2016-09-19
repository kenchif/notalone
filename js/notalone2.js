//notalone.js

//**********************
//window risize 時の処理
/*
$(window).resize(function(){
	brows_init();
});
*/
//**********************

//実行ページ名の格納変数
var thispage ="";

//デフォルトのメッセージ
var Def_info ="	誕生日の設定で年齢が表示できます。<br />お気に入りの画像も登録できます。<br />設定する時は画像をクリック！！<br />";

//Setting情報読み込み用　２次元配列
var settingArray;

//初期位置情報
var DEFAULT_LAT;
var DEFAULT_LNG;

//初期化
function init(){

	//setting データの読み出し
	var table = "../localhost/setting.csv";
	readSettingData(table , function(data){
		DEFAULT_LAT = parseFloat(getSetting("DEFAULT_LAT"));
		DEFAULT_LNG = parseFloat(getSetting("DEFAULT_LNG"));

		if(parseInt(getSetting("DRAGGABLE")) == 1){
			DRAGGABLE = true;
		}else{
			DRAGGABLE = false;
		}
	});


	//実行ページのチェック
	thispage = $("#thispage").html();

	switch(thispage){
		case "index.html"  :
			brows_init();
			index_init();

			break;

		case "events.html" :

			//target tableの読み込み
			var table = "localhost/target.csv";
			readTarget(table);

			//area tableの読み込み
			var table = "localhost/area.csv";
			readArea(table);

			//location tableの読み込み
			var table = "localhost/location.csv";
			readLocation(table);

			//FullCalendarの初期化を先に実行
			events_init();
			brows_init();

			break;

		case "inquiry.html" :
			brows_init();

			//inquiry tableの読み込み
			var table = "inquiry/inquiry.csv";
			readInquiry(table);

			//inquiry Dataの整形
			//inquirySetData();

			break;

		case "about.html"  :
			brows_init();
			//index_init();

			break;
	}	 
}


//ブラウザの初期化
function brows_init(){

	//共通部の設定****************
	//for menu
	var DeviceWidth    = window.innerWidth;		//ブラウザの横幅、スマホの横幅
	var DeviceHeight   = window.innerHeight;	//ブラウザの縦幅、スマホの縦幅
	var TopHeight = 30;				//トップメニューの縦幅
	var PcWidth = 480;				//パソコンの場合の横幅
	//*****************************

	//if(screen.width >= 480){
	if(DeviceWidth >= 480){
		//var BodyWidth = screen.width>=480? "480px" : "100%";
		var BodyWidth = PcWidth + "px";

		$("body").width(BodyWidth);
		var BodyWhite = parseInt(DeviceWidth,10) - parseInt(BodyWidth,10);

		var BodyLeftMargin = BodyWhite > 0 ? (BodyWhite / 2) + "px" : "0px";
		$("body").css({"margin-left" : BodyLeftMargin });
	}else{
		var BodyWidth = DeviceWidth + "px";
	}


	$("#top-menu").width(BodyWidth);
	$("#top-menu").css({"left" : BodyLeftMargin });
	$("#top-menu").height(TopHeight);
	$("#top-menu").css({"line-height" : TopHeight + "px"});

	
	//個別部の設定
	//************************
	switch(thispage){
		//****************
		case "index.html" :

	//$("#myCalendar").width(BodyWidth);
	//$("#myCalendar").css({"left" : BodyLeftMargin });




	$("#menu-back").height(TopHeight);
	$("#menu-back").css({"line-height" : TopHeight + "px"});

	//縦幅 var ritu = 0.5;
	var ImageHeight  = Math.round(DeviceHeight * 0.58);	//イメージ画像
	$("#notalone_image").height(ImageHeight);

	//縦幅 var ritu = 0.35;
	var PrivertHeight  = Math.round(DeviceHeight * 0.58);	//個人情報欄の縦幅確保
	var PhotoPadding = 5;				//個人情報　写真の余白
	$("#privert").height(PrivertHeight);
	$("#privert").css("display" , "none");	//初期非表示

	var MenuHeight = ( DeviceHeight - TopHeight - ImageHeight ) / 3;

	$(".jobmenu").height(MenuHeight);
	$(".jobmenu").css({"line-height" : MenuHeight + "px"});


	//イベント欄ダミーの高さ(px)
	$("#dummy").height(TopHeight);	//メニューの高さ分の余裕


	//$("#photo > img").css({"height" : (PrivertHeight - PhotoPadding * 2) + "px" , "padding" : PhotoPadding + "px"});
	//$("#photo > img").css({"height" : (PrivertHeight * 0.7 - PhotoPadding * 2) + "px" , "padding" : PhotoPadding + "px"});

	//canvasサイズは縦を基準、横幅は元画像から比率で設定
	//$("#myCanvas").css({"height" : (PrivertHeight - PhotoPadding * 2) + "px" , "padding" : PhotoPadding + "px"});
	$("#myCanvas").css({"height" : (PrivertHeight * 0.7 - PhotoPadding * 2) + "px" , "padding" : PhotoPadding + "px"});

	//canvas内に初期画像を表示
	//index_init()へ内包
	//ImageSet('myCanvas','images/notalone_icon.png');


	//選択画像の表示準備
	//localImageSet();

	//個人情報の読み出し　指標を表示
	favInit(0);


	//本体を表示
	$('#index_contener').css({
		"display" : "block"
	});

		break;

		//***************************
		case "events.html" :

	//for android fixed bug
	//下部ブロックの　onClick　イベントが検出できないため 

	//カレンダー表示の高さを規定（いずれかを設定）
	//縦横比率（数値が大きいほど縦が縮む）1.7
	//$('#calendar').fullCalendar('option', 'aspectRatio', 1.7);

	//カレンダーの高さ
	$('#calendar').fullCalendar('option', 'contentHeight', DeviceHeight * 0.5);

	// コンテンツの高さ(px)
	var calendar_div = $("#calendar").height();

	$("#menu-back").height(TopHeight);


	$("#calendar").css({
		"display"  : "block",
		"position" : "fixed",
		"top"      : DeviceHeight * 0.5,
		"width"  : BodyWidth,
		"font-size" : "14px",
		"background-color" : "#F5F5F5",
		"border"   : "1px solid #DCDCDC",
		"z-index"  : 1 
	});

	//customMonthButton 初期非表示
	$('.fc-myCustomMonth-button').css({'visibility':'hidden'});

	//カレンダーの表示ボタン
	$("#showBlock").css({
		"display"  : "none",
		"position" : "fixed",
		"top"      : 5,
		"padding-left" : 2,
		//"width"  : BodyWidth,
		"font-size" : "14px",
		//"background-color" : "#F5F5F5",
		//"border"   : "1px solid #DCDCDC",
		"z-index"  : 1 
	});


	//イベント欄ダミーの高さ(px)
	$("#dummy").height(DeviceHeight);

/*
	//iphone 問題なし
	$("#calendar").css({
		"display"  : "block",
		"position" : "fixed",
		"top"    : TopHeight,
		//"top"    : 400,
		"width"  : BodyWidth,
		"font-size" : "14px",
		"background-color" : "white",
		"z-index" : 0 
	});

	//カレンダー表示の高さを規定（いずれかを設定）
	//縦横比率（数値が大きいほど縦が縮む）
	$('#calendar').fullCalendar('option', 'aspectRatio', 1.7);

	//カレンダーの高さ
	//$('#calendar').fullCalendar('option', 'contentHeight', 200);

	// コンテンツの高さ(px)
	var calendar_div = $("#calendar").height();

	$("#menu-back").height(TopHeight + calendar_div);

	//イベント欄ダミーの高さ(px)
	$("#dummy").height(DeviceHeight - calendar_div - $("#top_menu").height());
*/


	//FullCalendar デザインの一部変更 *****
	$('.fc-toolbar').css({
		"height"  : "15px",
		"line-height" : "15px",
		"padding" : "5px"
	 });
/*	$('.fc-left').css({
		"height"  : "15px",
		"line-height" : "15px",
		"padding" : "5px",
	 });
*/
	$('.fc-center h2').css({
		"font-size" : "20px"
	});


	//map_area の表示位置を動的に調整
	$("#map_area").css({
		"left" : BodyLeftMargin
	});

	//set_area の表示位置を動的に調整
	$("#set_area").css({
		"left" : BodyLeftMargin
	});



	//**********************************


		break;

		//***************************
		case "inquiry.html" :

	$("#menu-back").height(TopHeight);
	$("#menu-back").css({"line-height" : TopHeight + "px"});

	//５メニューに対応可、実際は１メニューのみ。高さの調整のため８で割っている
	var MenuHeight = ( DeviceHeight - TopHeight ) / 8;


	$(".jobmenu").height(MenuHeight);
	$(".jobmenu").css({"line-height" : MenuHeight + "px"});

	//イベント欄ダミーの高さ(px)
	//$("#dummy").height(DeviceHeight - $("#top_menu").height());
	$("#dummy").height(50);

	//map_area の表示位置を動的に調整
	$("#map_area").css({
		"left" : BodyLeftMargin
	});

	//本体を表示
	$('#inquiry_contener').css({
		"display" : "block"
	});

		break;

		//***************************

		case "about.html" :

	$("#menu-back").height(TopHeight);
	$("#menu-back").css({"line-height" : TopHeight + "px"});

	//var MenuHeight = ( DeviceHeight - TopHeight - PrivertHeight ) / 3;
	var MenuHeight = ( DeviceHeight - TopHeight ) / 5;

	$(".about_title").height(MenuHeight);
	$(".about_title").css({"line-height" : MenuHeight + "px"});

	//イベント欄ダミーの高さ(px)
	$("#dummy").height(DeviceHeight - $("#top_menu").height());


	//map_area の表示位置を動的に調整
	$("#map_area").css({
		"left" : BodyLeftMargin
	});

	//本体を表示
	$('#about_contener').css({
		"display" : "block"
	});
		break;

		//***************************

	}


	//***************************
}


//topメニュー
function top_index(){
	location.href = "index.html";
}


//****for index.html ********
//index.html　初期化
function index_init(){
	//ローカルストレージに目的のデータがあるか確認 
	var key = "MyFavPicture";

	if (window.localStorage[key]) { 
		//存在すればそれを使用 
		ImageSet('myCanvas',window.localStorage[key]);
	}else{
		ImageSet('myCanvas','images/notalone_icon.png');
	} 
}

//2nd(next) menu link
function snd_index(link){
	switch(link){
		case "events"  : location.href="events.html";
				break;
 		case "aidmap"  : location.href="sub/map.html";
				break;
		case "inquiry" : location.href="inquiry.html";
				break;
		case "about"   : location.href="about.html";
				break;
	}
}

//settingMenuの切り替え
function setMenu(tab){
	var activ_css = {
		"background-color" : "#FFFFCC" ,
	};
	var stanby_css ={
		"background-color" : "#EEEEEE" ,
	};
	var activ_block={
		"display" : "block",
		"background-color" : "#FFFFCC" ,
	};
	var stanby_block={
		"display" : "none",
		"background-color" : "#EEEEEE" ,
	};

	if(tab == 1){
		$("#settingMenu1").css(activ_css);
		$("#favSetting").css(activ_block);
		$("#settingMenu2").css(stanby_css);
		$("#imageSetting").css(stanby_block);
	}else{
		$("#settingMenu2").css(activ_css);
		$("#imageSetting").css(activ_block);
		$("#settingMenu1").css(stanby_css);
		$("#favSetting").css(stanby_block);
	}
}

//プライベートエリア（画像、成長指標）の表示切り替え
function privert(){
	var flg = $("#privert").css("display");

	if(flg == "none"){
		$("#notalone_image").hide("blind", "", 1000 );
		$("#privert").show("blind", "", 1000 );
	}else{
		$("#privert").hide("blind", "", 1000 );
		$("#notalone_image").show("blind", "", 1000 );
	}
}

//誕生日等の個人情報設定欄の表示切り替え
function setting(){
	//var flg = $("#privert").css("display");
	var flg = $("#setting").css("display");

	if(flg == "none"){
		//$("#privert").show("blind", "", 1000 );
		$("#setting").show("blind", "", 1000 );
	}else{
		//$("#privert").hide("blind", "", 1000 );
		$("#setting").hide("bling", "", 1000 );
		//$("#notalone_image").show("blind", "", 1000 );
	}
}

//カレンダー（detepicker）による誕生日入力
$(function() {
	for(var i=1 ; i<=3 ; i++){
		var idname = "#bday" + i;

		$(idname).datepicker({
			//showButtonPanel: true,
			changeMonth: true,
			changeYear: true,
			dateFormat:'yy/MM/dd'
		});

		$(idname).datepicker("option", "showOn", 'button');
		$(idname).datepicker("option", "buttonImageOnly", true);
		$(idname).datepicker("option", "buttonImage", 'images/ico_calendar.png');

		$(idname).datepicker("option", "showButtonPanel", true);

	}
});

//datepicker　日本語化オプション
$(function($){
    $.datepicker.regional['ja'] = {
        closeText: '閉じる',
        prevText: '<前',
        nextText: '次>',
        currentText: '今日',
        monthNames: ['01','02','03','04','05','06',
        '07','08','09','10','11','12'],
        monthNamesShort: ['1月','2月','3月','4月','5月','6月',
        '7月','8月','9月','10月','11月','12月'],
        dayNames: ['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],
        dayNamesShort: ['日','月','火','水','木','金','土'],
        dayNamesMin: ['日','月','火','水','木','金','土'],
        weekHeader: '週',
        dateFormat: 'yy/mm/dd',
        firstDay: 0,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: '年'};
    $.datepicker.setDefaults($.datepicker.regional['ja']);
});


//******* cookie ********
//favorite max 3個
var MyFav_count = 3;
var MyFavFamily = new Array();
MyFavFamily[1] = {name: "" , bday: "" };
MyFavFamily[2] = {name: "" , bday: "" };
MyFavFamily[3] = {name: "" , bday: "" };
//***********************

function getCookie(key) {
	// Cookieから値を取得する
	var cookieString = document.cookie;
	// 要素ごとに ";" で区切られているので、";" で切り出しを行う
	var cookieKeyArray = cookieString.split(";");

	// 要素分ループを行う
	for (var i=0; i<cookieKeyArray.length; i++) {
		var targetCookie = cookieKeyArray[i];
		// 前後のスペースをカットする
		targetCookie = targetCookie.replace(/^\s+|\s+$/g, "");

		var valueIndex = targetCookie.indexOf("=");
		if (targetCookie.substring(0, valueIndex) == key) {
			// キーが引数と一致した場合、値を返す
			return unescape(targetCookie.slice(valueIndex + 1));
		}
	}
	return "";
}

function getMyFav(){
	for(var i = 1; i<= MyFav_count ; i++){	
		MyFavFamily[i]['name'] = getCookie("name"+i);
		MyFavFamily[i]['bday'] = getCookie("bday"+i);
	}
}

//お気に入り初期化
function favInit(type){
	//type : 0 指標のみ表示
	//type : 1 入力データも表示

	//*** cookie *****
	getMyFav();

	var fav_name;
	var fav_bday;

	var count = 0;
	var setdata = "<table>";

	for(i=1 ; i<=MyFav_count ;i++){
		fav_name = MyFavFamily[i]['name'];
		fav_bday = MyFavFamily[i]['bday'];

		if(fav_name != ""){
			if(type == 1){
				//入力欄に表示
				$("#name" + i).val(fav_name);
				$("#bday" + i).val(fav_bday);		
			}

			//子育て指標の表示
			count ++;
			setdata += "<tr><td>";
			setdata += "・" + fav_name;
			setdata += "</td><td>";
			setdata += "：" + calculateAge(fav_bday);
			setdata += "</td></tr>";
		}else{
			//入力欄クリア
			$("#name" + i).val('');
			$("#bday" + i).val('');		
		}
	}
	setdata += "</table>";

	if(count>0){
		$("#myFavFamily").html(setdata);
	}else{
		//設定がない場合（デフォルトメッセージ)
		$("#myFavFamily").html(Def_info);
	}
}

//誕生日からの経過年月日を算出（出産予定日対応）
function calculateAge(birthday) {
	// birth[0]: year, birth[1]: month, birth[2]: day
	var  birth = birthday.split('/');
	// 文字列型に明示変換後にparseInt
	var _birth = parseInt("" + birth[0] + birth[1] + birth[2]);

	var  today = new Date();
	// 文字列型に明示変換後にparseInt
	var _today = parseInt("" + today.getFullYear() + affixZero(today.getMonth() + 1) + affixZero(today.getDate()));


	//生まれてからの日数 
	var AlldiffDays = getDiff(birthday , today);




    	//経過月、日数を算出
	//今年の誕生日までの日数
	var  strToday    = today.getFullYear() + "/" + affixZero(today.getMonth() + 1) + "/" +  affixZero(today.getDate());
	//var  thisBirthday = today.getFullYear() + "/" + birth[1] + "/" + birth[2];

	if(_birth > _today){
		//出産予定の場合（未来月）		
		var  diffDays = getDiff(strToday , birthday) - 1;

		//平均月数(365/12)
		var diffMonth = diffDays / (365 / 12);
		//return diffDays + "日後（" + diffMonth.toFixed(1) + "月）"; 		
		return "あと" + diffDays + "日"; 		
	}else{
		//誕生日の場合
		//年数確定
		var Age = parseInt((_today - _birth) / 10000);

		//今年の誕生日
		var  thisBirthday = today.getFullYear() + "/" + birth[1] + "/" + birth[2];
		var  diffDays = getDiff(thisBirthday , strToday);

		//誕生日前の場合（うるう年考慮せず）
		if(strToday < thisBirthday){
			diffDays = 365 - Math.abs(diffDays);
		} 

		//平均月数(365/12)
		var diffMonth = parseInt(diffDays / (365 / 12));

		if(Age < 1){
			if(diffMonth <= 3){
				return diffDays + "日目（" + diffMonth + "月）";
				//return diffDays + "日目";
			}else{
				return diffMonth + "ケ月（" + AlldiffDays + "日）";
				//return diffMonth + "ケ月（" + diffDays + "日）";
				//return diffMonth + "ケ月";
			}
		}else{
			return Age + "歳" + diffMonth + "月（" + AlldiffDays + "日）"; 
			//return Age + "歳" + diffMonth + "月（" + diffDays + "日）"; 
			//return Age + "歳" + diffMonth + "ケ月"; 
		}
	}
}

function affixZero(int) {
    if (int < 10) int = "0" + int;
    return "" + int;
}


//日付の差分日数を返却します。
function getDiff(date1Str, date2Str) {
	var date1 = new Date(date1Str);
	var date2 = new Date(date2Str);
 
	// getTimeメソッドで経過ミリ秒を取得し、２つの日付の差を求める
	var msDiff = date2.getTime() - date1.getTime();
 
	// 求めた差分（ミリ秒）を日付へ変換します（経過ミリ秒÷(1000ミリ秒×60秒×60分×24時間)。端数切り捨て）
	var daysDiff = Math.floor(msDiff / (1000 * 60 * 60 *24));
 
	// 差分へ1日分加算して返却します
	return ++daysDiff;
}

/*
年間 365日　４年に１回　366日
月
   1  2  3   4   5   6   7   8   9  10  11  12
  31 28 31  30  31  30  31  31  30  31  30  31
    (29)
  31 59 90 120 151 181 212 243 273 304 334 365

  誕生日から今日までの日数を算出する　・・・　総日数
　日数を365日で割る　・・・　年数を算出
　　総日数から、年数分の日数を減算する
　　年数を４で割る　・・・　割れた回数分　総日数から減算する（うるう年対策）
　　　０の場合（４年未満）、誕生年から現在年まで、西暦でうるう年を判断し
　　　　

うるう年
（1）西暦年号が4で割り切れる年をうるう年とする。
（2）（1）の例外として、西暦年号が100で割り切れて400で割り切れない年は平年とする。

　２月２９日生まれは、２８日を起算日とする　
*/





function myfavSet(){
	//日付データを作成する
	//expires=' + new Date(2030, 1).toUTCString();
	var date1 = new Date(2030, 1).toUTCString();
	//2030年1月 日付データをセットする

	for(var i=1; i<=MyFav_count; i++){		
		//** cookie set
		document.cookie = "name" + i + "=" + escape($("#name" + i).val()) + ";expires=" + date1;
		document.cookie = "bday" + i + "=" + escape($("#bday" + i).val()) + ";expires=" + date1; 
	}

	favInit(1);
}

//cookie 強制削除
function myfavDel_all(){
	//日付データを作成する
	var date1 = new Date();
	//1970年1月1日00:00:00の日付データをセットする
	date1.setTime(0);
  	//有効期限を過去にして書き込む
	for(var i=1; i<= MyFav_count ; i++){
		//** cookie set
		fno = i;
		document.cookie = "name" + i + "=;expires=" + date1.toGMTString();
		document.cookie = "bday" + i + "=;expires=" + date1.toGMTString(); 
	}

	favInit(1);
}


//******** 
var IMAGES = [];
var imageType;
//********
//ローカル画像ファイルの表示
//function localImageSet(){
$(function(){
$("#uploadFile").change(function() {
    //canvas　の設定は　jqueryではうまくいかない
    //var canvas = $("#myCanvas");
    //var ctx = canvas[0].getContext("2d");

    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext("2d");

    // 選択されたファイルを取得
    var file = this.files[0];

    // 画像ファイル以外は処理中止
    if (!file.type.match(/^image\/(png|jpeg|gif)$/)){
	return;
    }else{
	imageType = file.type;
    }

    var reader = new FileReader();

    // File APIを使用し、ローカルファイルを読み込む
    reader.onload = function(evt) {

      // 画像の情報（base64）を配列に設定
      IMAGES.push(evt.target.result);


      //配列情報からcanvasに描画
      ImageSet('myCanvas' , IMAGES);

    }

    // ファイルを読み込み、データをBase64でエンコードされたデータURLにして返す
    reader.readAsDataURL(file);

  });
//}
});


//canvasに指定の画像を表示する
function ImageSet(canvasname,imagename){
    //var canvas  = $('#' + canvasname);
    //var context = canvas[0].getContext('2d');

    var canvas  = document.getElementById(canvasname);
    var context = canvas.getContext('2d');

    var image = new Image();
    image.src = imagename;

    image.addEventListener('load', function() {
	var swidth  = image.width;
	var sheight = image.height;
	var sexp    = swidth / sheight;

        //var iheight = canvas.height();
        var iheight = canvas.height;
        var iwidth  = parseInt(iheight * sexp);

	//canvasのサイズ変更は　css は NG（縦長） --> attr　で設定
	//$(canvas).attr('width'  , iwidth);
	//$(canvas).attr('height' , iheight);
	canvas.width  = iwidth;
	canvas.height = iheight;

        //context.drawImage(image, 100, 100);
        //context.drawImage(image, 0 , 0 , iwidth , iheight);
        context.drawImage(image, 0 , 0 , iwidth , iheight);
    }, false);
}

/*  画像の保存方法　その１
//画像ファイルのアップロード
$(function(){
    $('#imgupload').submit(function(){
	var fd = new FormData($('#imgupload').get(0));
        $.ajax({
            url: "photouploader.php",
	    type: 'POST',
	    data : fd,
	    processData : false,
	    contentType : false,
            dataType: 'json'
        })
        .done(function( data ) {
            $('#result').text(data.width + "x" + data.height);
        });

        return false;	//表示をリフレッシュしない

    });
});
*/

//canvasに読み込んだ画像をローカルストレージに保存
function imgStorageSet(){
	//var canvas = $("#myCanvas");
	//var ctx = canvas[0].getContext("2d");
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	//alert("画像の保存方法は検討中です");
	//return false;


	//ローカルストレージに保存 
	//toDataURL は、ローカルのイメージをクロスドメインと判断する
	//window.localStorage["MyFavPicture"] = canvas.toDataURL('image/jpeg'); 
	window.localStorage["MyFavPicture"] = canvas.toDataURL(imageType); 

	alert("選択した画像情報を保存しました");
}

//ローカルストレージのキャッシュをクリアする
function imgStorageClear(){
	//キャッシュをクリアする場合 
	window.localStorage.clear();
	alert("登録していた画像情報を消去しました");
}
//****************************




//**** for events.html *******
var Today    = new Date();

//本日年月
var TodayYear  = Today.getFullYear();
var TodayMonth = Today.getMonth() + 1; 	//month = 0から始まる
var TodayDay   = Today.getDate();

//基準年月
var SetYear  = TodayYear;
var SetMonth = TodayMonth;
var SetDay   = TodayDay; 


var event_dir = "events/";	//イベントファイルの保存ディレクトリ
var event_ext = ".csv";		//イベントファイルの拡張子

var eventArray  = new Array();	//イベント用配列（２次元：連想配列）
var targetArray = new Array(); //tag1用配列（２次元：連想配列） 
var areaArray   = new Array(); //地域用配列（２次元：連想配列） 
var locationArray = new Array(); //開催場所用配列（２次元：連想配列） 

var JpWeekday = ['日','月','火','水','木','金','土'];	//日本語曜日


//基準月に応じたファイルを読み込みeventArrayに保存
//function readEvents(target){
function readEvents(target , cb){
	//配列初期化
	eventArray = new Array();

	//イベント一覧、fullcalendarイベント初期化
	$('#events-title').empty();
	$('#calendar').fullCalendar('removeEvents');


	switch(target){
		case  0 : //初期・当月または基準月
			  SetYear  = Today.getFullYear();
			  SetMonth = Today.getMonth() + 1; 
			  break;
			  //翌月
		case  1 : SetMonth++;
			  if(SetMonth > 12){
				SetMonth -= 12;
				SetYear++;
			  }
			  break;
			  //前月
		case -1 : SetMonth--;
			  if(SetMonth < 1){
				SetMonth += 12;
				SetYear--;
			  }
			  break;

			 //いずれも該当しない（絞りみの再表示）
		default : 
	}

	var thisMonth = SetYear + ("0" + SetMonth).substr(-2);
	var eventfile = event_dir + thisMonth + event_ext;

	//csvToArray("events/201511.csv", function(data) {
	csvToArray( eventfile , function(data) {

		//1行目をフィールド名として扱い連想配列にする
		for(var i = 1 ; i < data.length ; i++){
			var rensou = new Object();
			for(var s = 0; s < data[i].length ; s++){
				rensou[data[0][s]] = data[i][s]; 
			}
			eventArray.push(rensou);
		}


		//eventArray を日付、開始時間で昇順ソートする
		//降順は、-1 , 1 を逆にする
		//ev_when : 年月 ev_open : 開始時間
		eventArray.sort(function(a,b){
			if(a[ev_when] < b[ev_when]) return -1;
			if(a[ev_when] > b[ev_when]) return 1;
			if(a[ev_open] < b[ev_open]) return -1;
			if(a[ev_open] > b[ev_open]) return 1;
			return 0;
		});

		//callback化
		cb();
		//*********
	});
}

//target（tag1）ファイルを読み込みtargetArrayに保存
function readTarget(table){
	csvToArray( table , function(data) {

		//1行目をフィールド名として扱い連想配列にする
		for(var i = 1 ; i < data.length ; i++){
			var rensou = new Object();
			for(var s = 0; s < data[i].length ; s++){
				rensou[data[0][s]] = data[i][s]; 
			}
			targetArray.push(rensou);
		}
	});
}

//area（地域）ファイルを読み込みareaArrayに保存
function readArea(table){
	csvToArray( table , function(data) {

		//1行目をフィールド名として扱い連想配列にする
		for(var i = 1 ; i < data.length ; i++){
			var rensou = new Object();
			for(var s = 0; s < data[i].length ; s++){
				rensou[data[0][s]] = data[i][s]; 
			}
			areaArray.push(rensou);
		}
	});
}

//location（開催場所）ファイルを読み込みlocationArrayに保存
function readLocation(table){
	csvToArray( table , function(data) {

		//1行目をフィールド名として扱い連想配列にする
		for(var i = 1 ; i < data.length ; i++){
			var rensou = new Object();
			for(var s = 0; s < data[i].length ; s++){
				rensou[data[0][s]] = data[i][s]; 
			}
			locationArray.push(rensou);
		}

		//googlemap の初期設定
		mapInit();
	});
}

//開催場所から、location情報を取得（確認）
function getLocationLatLng(where){
	var loc  = locationArray;

	var nlat = "";
	var nlng = "";

	for(var i = 0; i < loc.length ; i++){
		if(loc[i][loc_name] == where){
			nlat = loc[i][loc_lat];
			nlng = loc[i][loc_lng];
			break;
		}
	}

	if(nlat != "" && nlng != ""){
		return i;
	}else{
		return -1;
	}
}

//開催場所から、area名を取得
function getLocationAreaName(where){
	var loc  = locationArray;

	var area = "";

	for(var i = 0; i < loc.length ; i++){
		if(loc[i][loc_name] == where){
			area = loc[i][loc_area];
			break;
		}
	}

	if(area != "" ){
		return area;
	}else{
		return -1;
	}
}



var now_marker;		//位置表示用マーカー
var now_infowindow;	//インフォウインドウ
function mapInit(){
	//sub/js/main/js　で定義
	//どこかで設定ファイルの作成が必要
	//var DEFAULT_LAT = 37.390556;
    	//var DEFAULT_LNG = 136.899167;

	showGoogleMap(DEFAULT_LAT,DEFAULT_LNG);
}

function showGoogleMap(initLat, initLng) {
        var latlng = new google.maps.LatLng(initLat, initLng);
        var opts = {
            	zoom: 16,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        //var map = new google.maps.Map(document.getElementById("map_canvas"), opts);
        mapCanvas = new google.maps.Map(document.getElementById("map_canvas"), opts);

        //現在地のピン
        var now_latlng = new google.maps.LatLng(initLat, initLng);
        //var now_marker = new google.maps.Marker({
        now_marker = new google.maps.Marker({
            position:now_latlng,
            title: '位置表示用マーカー',
	    /*draggable : true,*/

            map: mapCanvas,
        });

	//***********
        now_infowindow = new google.maps.InfoWindow();
	var html = "test info";
        now_infowindow.setContent(html);

        google.maps.event.addListener(now_marker, 'click', function() {
            now_infowindow.open(mapCanvas , now_marker);
        });
	//***********

	now_marker.setMap(mapCanvas);
}

//function eventMap_visible(nlat,nlng){
function eventMap_visible(locationNo){
	//location位置情報
	var nlat = locationArray[locationNo][loc_lat];
	var nlng = locationArray[locationNo][loc_lng];

	var latlng = new google.maps.LatLng(nlat , nlng);

	//******
	var html = "<h5>";
	html += locationArray[locationNo][loc_name] + "<br />";
	html += locationArray[locationNo][loc_memo];
	html += "</h5>";

        now_infowindow.setContent(html);
	//******

	now_marker.setPosition(latlng);
	mapCanvas.setCenter(latlng);

	$('#map_area').css('visibility' , 'visible');
}

function eventMap_hidden(){
	//openInfoWindow close
        now_infowindow.close();

	$('#map_area').css('visibility' , 'hidden');
}

function Area_setting(){

	//ローカルストレージから表示条件を読み出し
	if(window.localStorage["AreaMode"]){
		var area_mode = window.localStorage["AreaMode"];
	}else{
		var area_mode = '0';	//default
	}

	if(window.localStorage["AreaName"]){
		var check_area = window.localStorage["AreaName"].split(",");
	}else{
		var check_area = "";
	}

	if(window.localStorage["LocName"]){
		var check_loc  = window.localStorage["LocName"].split(",");
	}else{
		var check_loc  = "";
	}

	if(window.localStorage["TagId"]){
		var check_tag  = window.localStorage["TagId"].split(",");
	}else{
		var check_tag  = "";
	}



	//条件設定エリアの内容作成
	var buff = "<b>イベントの絞り込み</b><br />";
	//buff += "<input type='button' value='絞り込んで表示する' onClick='setArea_setting()' /><br />";
	buff += "<input type='button' value='絞り込んで表示する' onClick='checkArea_setting(1)' /><br />";
	buff += "<input type='button' onClick='checkArea_setting(0)' value='全てのイベントを表示する' /><br />";
	buff += "<input type='button' value='キャンセルして閉じる' onClick='setArea_hidden()' /><br />";

	buff += "<hr />";

	buff += "<form >";
	//buff += "<input type='reset'  value='条件を初期化する' /><br />";

	/*
	buff += "<input type='radio' name='area_mode' ";
	if(area_mode == '0'){
		buff += " checked ";
	}
	buff += " value='0' />：条件を初期化する<br />";

	buff += "<hr />";
	buff += "<input type='radio' name='area_mode' ";
	if(area_mode == '1'){
		buff += " checked ";
	}
	buff += " value='1' />：地域または場所を限定する<br />";
	*/


	buff += "<input type='button' value='絞り込み条件を保存する' onClick='setArea_save()' /><br />";
	//buff += "*保存すると常にこの条件で表示されます<br />";

	buff += "<input type='checkbox' name='area_mode' ";
	if(area_mode == '1'){
		buff += " checked ";
	}
	buff += " value='1' />：絞り込み条件の有効化<br />";
	//buff += "（全てを表示する場合はチェックを外す）<br />";

	//areaArrayの一覧を表示
	var areaName  = "";
	var areaColor = "";
	var areaText  = "";
	var areaVisi  = "";

	var locName  = "";
	var locVisi  = "";
	for(var s = 0; s < areaArray.length ; s++){
		areaName  = areaArray[s][area_label];
		areaColor = areaArray[s][area_color];
		areaText  = areaArray[s][area_text];
		areaVisi  = areaArray[s][area_visi];

		buff += "<div style='background:" + areaColor + ";";
		buff += "color:" + areaText + ";'>";
		buff += "　<input type='checkbox' class='area'";
		for(var l = 0 ; l < check_area.length ; l++){
			if(check_area[l] == areaName){
				buff += " checked ";
			}
		}

		buff += " name='" + areaName + "' value='" + areaName + "' />：";
		buff += areaName;

		for(var m = 0 ; m < locationArray.length ; m++){
			if(locationArray[m][loc_area] == areaName){
				locName = locationArray[m][loc_name];
				locVisi = locationArray[m][loc_visi];

				buff += "<br />";
				buff += "<input type='checkbox' class='loc'";
				for(var l = 0 ; l < check_loc.length ; l++){
					if(check_loc[l] == locName){
						buff += " checked ";
					}
				}
				buff += " name='" + locName + "' value='" + locName + "' />";
				buff += locName;
			}
		}

		buff += "</div>";
	}

	//地域区分なし　targetArray を設定する
	buff += "<div style='background:" + default_area_color + ";";
	buff += "color:" + default_area_text + ";'>";
	buff += "　<input type='checkbox' class='area'";
	for(var l = 0 ; l < check_area.length ; l ++){
		if(check_area[l] == "area_non"){
			buff += " checked ";
		}
	}
	buff += " name='area_non' value='area_non' />：";
	buff += "任意(tag1)";
	for(var m = 0 ; m < targetArray.length ; m++){
		tarName  = targetArray[m][tar_label];
		tarId    = targetArray[m][tar_id];
		tarColor = targetArray[m][tar_color];
		tarText  = targetArray[m][tar_text];
		tarVisi  = targetArray[m][tar_visi];

		buff += "<div style='background:" + tarColor + ";";
		buff += "color:" + tarText + ";'>";
		buff += "<input type='checkbox' class='tag1'";
		for(var l = 0 ; l < check_tag.length ; l++){
			if(check_tag[l] == tarId){
				buff += " checked ";
			}
		}
		buff += " name='" + tarId + "' value='" + tarId + "' />";
		buff += tarName;
		buff += "</div>";
	}

	buff += "</div>";

	buff += "</form>";


	$("#set_area").html(buff);
	//$("#set_area").css({ "visibility" : "visible"});
}

function setArea_hidden(){
	$('#set_area').css('visibility' , 'hidden');
}

function setArea_visible(){
	//topへスクルール
	$("html,body").animate({scrollTop:0},{duration: 1000});

	$('#set_area').css('visibility' , 'visible');
}

//イベント地域条件で再表示
function setArea_setting(){
	setArea_hidden();

	$('#calendar').fullCalendar('changeView','month');
	//$('#calendar').fullCalendar('today');

	//再表示
	readEvents(100 , function(){
		eventSetCalendar(function(){
			//callback dummy
		});
	});
}

//イベント表示条件をチェックしイベントを表示する
function checkArea_setting(sw){
	//sw 0 : all  sw : 1 area

	//$('#checkbox').prop('checked',false);
	//$('#checkbox').prop('checked',true);
	if(sw == 1){
		$('input[name="area_mode"]').prop('checked',true);		
	}else{
		$('input[name="area_mode"]').prop('checked',false);		
	}

	setArea_setting();
}

//地域条件の保存
function setArea_save(){
	//var area_mode = $('input[name="area_mode"]:checked').val();
	if($('input[name="area_mode"]').prop('checked')){
		var area_mode = 1;
	}else{
		var area_mode = 0;
	}

	var area = $('[class="area"]:checked').map(function(){
  		return $(this).val();
	}).get();

	var area_buff = "";
	for(var i = 0 ; i < area.length ; i++){
		area_buff += area[i];
		if(i < area.length -1 ){
			area_buff += ",";
		} 
	}

	var loc = $('[class="loc"]:checked').map(function(){
  		return $(this).val();
	}).get();

	var loc_buff = "";
	for(var i = 0 ; i < loc.length ; i++){
		loc_buff += loc[i];
		if(i < loc.length -1){
			loc_buff += ",";
		} 
	}


	var tag = $('[class="tag1"]:checked').map(function(){
  		return $(this).val();
	}).get();

	var tag_buff = "";
	for(var i = 0 ; i < tag.length ; i++){
		tag_buff += tag[i];
		if(i < tag.length -1){
			tag_buff += ",";
		} 
	}

	//ローカルストレージに保存
	window.localStorage["AreaMode"] = area_mode;
	window.localStorage["AreaName"] = area_buff;
	window.localStorage["LocName"]  = loc_buff;
	window.localStorage["TagId"]    = tag_buff;

	alert("表示条件を保存しました");
}


//開催場所と地域設定　またはtag1のチェック
function LocToSetArea(loc,tag){ 

	/*
	var areaMode = $('input[name="area_mode"]:checked').val(); 
	if(areaMode == 0){
		return 1;
	}
	*/

	//絞り込み条件が無効（チェックなし）な場合
	if($('input[name="area_mode"]').prop('checked')){
	}else{
		return 1;
	}

	//開催場所から地域名を取得
	var areaName = getLocationAreaName(loc);
	//地域名が設定されていない（開催場所登録がない）場合
	if(areaName == -1 ){
		//任意(tag1)にチェックがある場合
		if($("[name=area_non]").prop("checked")){
			return 1;
		}else{
			//tag_idのcheck
			if(targetId_check(tag) == 1){
				//任意(tag1)にチェックがある場合
				if($("[name=" + tag + "]").prop("checked")){
					return 1;
				}
			}
		}
	}

	//地域名にチェックがある場合
	if($('input[name="' + areaName + '"]').prop('checked')){
		return 1;
	}

	//開催場所にチェックがある場合
	if($('input[name="' + loc + '"]').prop('checked')){
		return 1;
	}

	return -1;

}



/***  event csv format 変換テーブル  ****/
var ev_title = "eventtitle";	//タイトル
var ev_where = "where";		//開催場所
var ev_whom  = "whom";		//対象者
var ev_what  = "what";		//内容
var ev_who   = "who";		//主催者
var ev_cont  = "contact";	//申し込み先
var ev_fee   = "fee";		//参加費
var ev_when  = "when";		//開催日　　yyyy/mm/dd
var ev_open  = "openTime";	//開始時間　hh:mm:ss  or  hh:mm
var ev_close = "closeTime";	//終了時間　hh:mm:ss  or  hh:mm
var ev_cat   = "tag1";		//識別・カテゴリー
var ev_url   = "url";		//URL

//スクリプト内で作成
var ev_no    = "no";		//必須
var ev_year  = "year";		//イベント年　ev_when から取得
var ev_month = "month";		//イベント月
var ev_day   = "day";		//イベント日

var ev_area  = "area_name";	//地域名
/*********/

/***  target csv format 変換テーブル  ****/
var tar_label = "target_label";	//
var tar_id    = "target_id";	//
var tar_color = "color";	//
var tar_text  = "text_color";	//
var tar_icon  = "icon";		//
var tar_visi  = "visible";	//イベント表示選択用
var default_tar_color = "#ffffff";	//
var default_tar_text  = "#604037";	//
/*********/

/***  area csv format 変換テーブル  ****/
var area_label = "area_name";	//
var area_color = "color";	//
var area_text  = "text_color";	//
var area_icon  = "icon";
var area_visi  = "visible";		//イベント表示選択用
var default_area_color = "#ffffff";	//
var default_area_text  = "#604037";	//
/*********/

/***  location csv format 変換テーブル  ****/
var loc_area = "area_name";	//
var loc_name = "location_name";	//
var loc_id   = "location_idt";	//
var loc_lat  = "lat";		//
var loc_lng  = "lng";		//
var loc_address = "address";	//
var loc_memo = "memo";		//
var loc_visi = "visible";	//イベント表示選択用
/*********/


//地域別表示用データのセット状態
var areaSettingFlg = 0;

//tag1のtargetId正当性確認
function targetId_check(nid){
	for(var i = 0 ; i < targetArray.length ; i++){
		if(targetArray[i][tar_id] == nid){
			return 1;
		}
	}
	return -1;
}


//eventArrayのデータをFullCalendarに設定する（月単位）
//function eventSetCalendar(){
function eventSetCalendar(cb){

	//地域の設定情報（初めてのイベント読み込み時のみ動作）
	if(areaSettingFlg == 0){
		Area_setting();
		areaSettingFlg = 1;
	}
	//************




	var source = new Array();

	var evtclass , evttitle , evtday , weekday;
	var evtcont;
	var tg1 = "<tr><th>";
	var tg2 = "</th><td>";
	var tg3 = "</td></tr>"; 

	//var bcolor , tcolor;
	var bcolor = default_tar_color;
	var tcolor = default_tar_text;

	//地図リンク用画像
	var maplink   = "<img src='images/maplink.png' height='20px' ";

	var ev,loc,edata,areaName;
	for(var i =0 ; i < eventArray.length ; i++){

		//var ev = eventArray[i];
		ev = eventArray[i];


		//**************
		//地域設定の確認　またはtag1の確認
		if(LocToSetArea(ev[ev_where],ev[ev_cat]) == -1){
			continue;
		}
		//**************




		//location位置情報の確認
		//var loc = getLocationLatLng(ev[ev_where]);
		loc = getLocationLatLng(ev[ev_where]);

		//var edata = new Object();
		edata = new Object();

		//FullCalendar 用のデータセット
		edata['id']    = i + 1;

		if(loc != -1){
			//edata['title'] = locationArray[loc][loc_area] + ":" + eventArray[i][ev_title];
			//地域名を表示しない仕様に変更
			//ev_area = locationArray[loc][loc_area];
			ev[ev_area] = locationArray[loc][loc_area];
			edata['title'] = eventArray[i][ev_title];
		}else{
			edata['title'] = eventArray[i][ev_title];
		}

		//開催日 yyyy/mm/dd -> yyyy-mm-dd  FullCalendar formatに合わせる
		//edata['start'] = eventArray[i][ev_when].replace(/\//g,"-");
		edata['start'] = eventArray[i][ev_when].replace(/\//g,"-");
		edata['start'] += " " + eventArray[i][ev_open];


		//地域によって色設定 ************
		//target優先、空白の場合 areaで色設定
		edata['color']     = default_area_color;
		edata['textColor'] = default_area_text;

		var looked = 0;
		for(var s = 0; s < targetArray.length ; s++){
			if(eventArray[i][ev_cat] == targetArray[s][tar_id]){
				edata['color']     = targetArray[s][tar_color];
				edata['textColor'] = targetArray[s][tar_text];
				looked = 1;
				break;
			}
		}
		//targetがヒットしない場合
		//locationArrayの地域名からareaArrayを検索
		if(looked == 0){
			for(var s = 0; s < areaArray.length ; s++){
				//if(ev_area == areaArray[s][area_label]){
				if(ev[ev_area] == areaArray[s][area_label]){
					edata['color']     = areaArray[s][area_color];
					edata['textColor'] = areaArray[s][area_text];
					break;
				}
			}
		}
		//*******************************


		source.push(edata);


		/*
		//イベント欄に一覧表示する
		if((i % 2) == 0){
			evtclass = "calendar-event-even";
		}else{
			evtclass = "calendar-event-odd";
		}
		//target color に変更
		*/
		evtclass = "calendar-event";

		//var ev = eventArray[i];

		//アコーディオン用のデータセット
		ev['no'] = i + 1;

		//when から　年月日取得
		buff = ev[ev_when].split("/"),
		ev[ev_year]  = buff[0];
		ev[ev_month] = buff[1];
		ev[ev_day]   = buff[2];	

		//イベント日から曜日を取得
		evtday  = new Date(ev[ev_year] + "/" + ev[ev_month] + "/" + ev[ev_day]);
		weekday = JpWeekday[evtday.getDay()];

		//イベントのタイトル
		evttitle  = "<div id='evtid_" + ev[ev_no] + "_title' ";
		evttitle += "onClick='selectEvent(" + ev[ev_no] + ")' ";

		//evttitle += "class='" + evtclass + "'>";
		evttitle += "class='" + evtclass + "' "; 
		evttitle += "style='background-color:" + edata['color'] + "; ";
		evttitle += "color:" + edata['textColor'] + ";' >";

		//過去イベントの表示
		if(PastEvent(ev[ev_when]) == 1){
			evttitle += "_";
		}

		evttitle += ev[ev_day] + "日(" + weekday + ") ";

		//AM PM　fullcalendar に合わす
		//evttitle += (ev[ev_open].substr(0,2) < 12 ? 'Am' : 'Pm') + " ";
		evttitle += (ev[ev_open].substr(0,2) < 12 ? 'A' : 'P') + " ";


		//area*************
		//location位置情報の確認
		//var loc = getLocationLatLng(ev[ev_where]);
		if(loc == -1){

		}else{
			//地域名を表示しない仕様に変更
			//evttitle += "(" + locationArray[loc][loc_area] + ") ";
		}
		//*****************

		
		//evttitle += ev[ev_title].substr(0,16);
		evttitle += ev[ev_title];
		evttitle += "</div>";

		$("#events-title").append(evttitle);

		//イベントの詳細
		evtcont  = "<div id='evtid_" + ev[ev_no] +"' ";
		evtcont += "class='calendar-event-cont'>";

		evtcont += "<table class='eventclass'>";

		evtcont += tg1 + "名称"  + tg2 + ev[ev_title] + tg3;
		//evtcont += tg1 + "時間"  + tg2 + ev[ev_open].substr(0,5) + "〜" + ev[ev_close].substr(0,5) + tg3;
		evtcont += tg1 + "日時"  + tg2 + ev[ev_when].substr(5,2)+ "月" + ev[ev_when].substr(8,2) + "日(" + weekday + ") " + ev[ev_open].substr(0,5) + "〜" + ev[ev_close].substr(0,5) + tg3;

		evtcont += tg1 + "内容"  + tg2 + ev[ev_what] + tg3;

		evtcont += tg1 + "対象者" + tg2 + ev[ev_whom] + tg3;
		//evtcont += tg1 + "(tag1)"   + tg2 + ev[ev_cat] + tg3;

		if(ev[ev_fee] == 0 || ev[ev_fee] ==""){
			evtcont += tg1 + "参加費" + tg2 + "無料" + tg3;
		}else{
			evtcont += tg1 + "参加費" + tg2 + ev[ev_fee] + "円" + tg3;
		}

		//location位置情報の確認
		//var loc = getLocationLatLng(ev[ev_where]);
		if(loc == -1){
			evtcont += tg1 + "場所"  + tg2 + ev[ev_where] + tg3;
		}else{
			evtcont += tg1 + "場所"  + tg2;
			/*
			var nlat = locationArray[loc][loc_lat];
			var nlng = locationArray[loc][loc_lng];
			evtcont += "<input type='button' value='" + ev[ev_where] + "' onClick='eventMap_visible(" + nlat + "," + nlng + ")' >";
			*/

			//evtcont += "<input type='button' value='" + ev[ev_where] + "' onClick='eventMap_visible(" + loc + ")' >";
			evtcont += ev[ev_where] + " ";
			evtcont += maplink + " onClick='eventMap_visible(" + loc + ")' />";


			//イベント開催場所のメモを表示
			var nmemo = locationArray[loc][loc_memo];
			if(nmemo !=""){
				evtcont += "<br />";
				evtcont += nmemo;
			}

			evtcont += tg3;
		}

		//電話発信機能 電話番号のチェック
		var teldata = telNumber(ev[ev_cont]);
		if(teldata == -1 ){
			evtcont += tg1 + "連絡先" + tg2 + ev[ev_cont] + tg3;
		}else{
			evtcont += tg1 + "連絡先" + tg2 + "<a href='tel:" + teldata + "' >" + ev[ev_cont] + "</a>" + tg3;
		}


		evtcont += tg1 + "主催者" + tg2 + ev[ev_who] + tg3;

		//url 追加（簡易チェック）
		if(ev[ev_url] != ""){
			if(urlStrings(ev[ev_url]) == 1){
				evtcont += tg1 + "URL" + tg2;
				evtcont += "<a href='" + ev[ev_url] + "' target='_blank'>";
				//evtcont += "<p onClick='window.open(\"" + ev[ev_url] + "\",\"_blank\")'>";
				evtcont += ev[ev_url] + "</p>" + tg3;
			}
		}

		//色別検証用
		evtcont += tg1 + "(color)" + tg2;
		evtcont += "tag1:" + ev[ev_cat]  + "　";
		evtcont += "area:" + ev[ev_area] + tg3;


		evtcont +="</table>";

		evtcont += "</div>";	

		$("#events-title").append(evtcont);	
	}

	//連想配列でsourceを渡し、カレンダーにイベントを追加する	
	$('#calendar').fullCalendar('addEventSource', source );


	//callback化
	$(evttitle).ready(function(){
		//表示完了したらコールバック
		//現状、イベントの表示完了が検知できない状態です（意味なし機能）
		//alert("ready");
		cb();
	});
	//*********

}


//イベントタイトルのアコーディオン機能
var openEvt = "";

function evtScroll(callEvt){
	
	//スクロール量の計算
	var targetY  = $(callEvt).offset().top;		//イベントタイトルの現在位置
	targetY -= $(callEvt + "_title").height();	//イベントタイトルの高さ減算
	targetY -= $("#menu-back").height(); 		//メニューバックの高さ減算
	//スクロール実施
	$("html,body").animate({scrollTop:targetY},{duration: 1000});

//alert(callEvt);
//alert(targetY);
}

//イベントの選択
function selectEvent(idno){
	var callEvt = '#evtid_' + idno;

	if(openEvt != ""){
		//イベント詳細が開いている場合は、閉じてから次のオープンに進む
		$(openEvt).hide("blind" , "" , 200 ).promise().done(function(){

			if(openEvt == callEvt){
				openEvt = "";
			}else{
				$(callEvt).show("blind", "", 500 );
				openEvt = '#evtid_' + idno;

				evtScroll(openEvt);
			}

		});	
	}else{
		//イベント詳細が開いていない場合
		$(callEvt).show("blind", "", 1000 );
		openEvt = '#evtid_' + idno;

		evtScroll(openEvt);
	}
}


//過去イベントのチェック
function PastEvent(eday){
	var Today    = new Date();

	//年月日
	var month = "0" + TodayMonth;
	var day   = "0" + TodayDay;

	var search = TodayYear + "/" + month.substr(month.length - 2, 2) + "/" + day.substr(day.length - 2 , 2);

	if(search > eday){
		return 1;
	}else{
		return -1;
	}
}


//当日、または当日に一番近いイベントにスクロールする
//現在機能していない
function TodayEvent(){
	//年月日
	var month = "0" + SetMonth;
	var day   = "0" + SetDay;

	var search = SetYear + "/" + month.substr(month.length - 2, 2) + "/" + day.substr(day.length - 2 , 2);

 	var data   = "";
	var len = eventArray.length;

	for(var i = 0 ; i < len ; i++){ 
		data = eventArray[i][ev_when];
		if(search <= data){

			var openEvt = '#evtid_' + (i + 1);
			evtScroll(openEvt);
//alert(openEvt);
			break;
		}
	}
}

//eventLimit Click した日のイベントをスクロールアップ
//機能していない
function LimitEvent(fdate){
	//fdateはフォーマットかされた日付
	var search = fdate;

 	var data   = "";
	var len = eventArray.length;

	for(var i = 0 ; i < len ; i++){ 
		data = eventArray[i][ev_when];
		if(search <= data){

			var openEvt = '#evtid_' + (i + 1);
			evtScroll(openEvt);
//alert(openEvt);
			break;
		}
	}
}


//FullCalendar（イベントカレンダー）の初期設定
function events_init(){

	$(document).ready(function() {

		//eventデータの読み込み
		//readEvents();
		//readEvents(0);

		//******************

		$('#calendar').fullCalendar({

			//カスタムボタンによるヘッダーの設定
			customButtons: {				
        			myCustomToday: {
            				text: '今月',
					size: 'small',
            				click: function() {
               					//alert('今日へ');
						$('.fc-myCustomMonth-button').css({'visibility':'hidden'});
						$('#calendar').fullCalendar('changeView','month');
						$('#calendar').fullCalendar('today');

						//readEvents(0);
						//setTimeout("eventSetCalendar()" , 1000);
						readEvents(0 , function(){
							eventSetCalendar(function(){
								//callback dummy
							});
						});
            				}
	        		},
        			myCustomMonth: {
            				text: '戻る',
            				click: function() {
               					//alert('前月へ');
						$('.fc-myCustomMonth-button').css({'visibility':'hidden'});
						$('#calendar').fullCalendar('changeView','month');
            				}
	        		},

				//カレンダー非表示ボタン
				myCustomBlock: {
					text: '●',
					click: function(){
							$("#calendar").css({
								"display"  : "none"
							});

							/*$(".fc-view-container").css({
								"visibility"  : "hidden"
							});*/

							$("#showBlock").css({
								"display" : "block"
							});
					       }
				},

				//設定メニューボタン
				myCustomSet: {
					text: '＊',
					click: function(){
							/*
							if(areaSettingFlg == 0){
								Area_setting();
								areaSettingFlg = 1;
							}
							*/
							setArea_visible();
					       }
				},
        		
				myCustomPrev: {
            				text: '＜',
            				click: function() {
               					//alert('前月へ');
						$('.fc-myCustomMonth-button').css({'visibility':'hidden'});
						$('#calendar').fullCalendar('changeView','month');
						$('#calendar').fullCalendar('prev');

						//readEvents(-1);
						//setTimeout("eventSetCalendar()" , 1000);
						readEvents(-1 , function(){
							eventSetCalendar(function(){
								//callback dummy
							});
						});

            				}
	        		},
        			myCustomNext: {
            				text: '＞',
            				click: function() {
               					//alert('翌月へ');
						$('.fc-myCustomMonth-button').css({'visibility':'hidden'});
						$('#calendar').fullCalendar('changeView','month');
						$('#calendar').fullCalendar('next');

						//readEvents(1);
						//setTimeout("eventSetCalendar()" , 1000);
						readEvents(1 , function(){
							eventSetCalendar(function(){
								//callback dummy
							});
						});

           				}
	        		},
			},


			header: {

        			//left: 'prev,next today myCustomButton',
        			//left: 'prev,next today',
				left: 'myCustomBlock,myCustomSet,myCustomMonth',

        			center: 'title',
				//center: '',

        			//right: 'month,basicDay'
				right: 'myCustomPrev,myCustomToday,myCustomNext'
			},
			//******************


			//タイトルのフォーマット
	        	titleFormat: {
        	    		month: 'YYYY年M月',	// 2013年9月
				week:  'YYYY年M月',
				day:   'YYYY年M月',
			},

 	       		// ボタン文字列
        		buttonText: {
            			prev:     '＜', // <
            			next:     '＞', // >
            			prevYear: '前年',  // <<
            			nextYear: '翌年',  // >>
            			today:    '今日',
            			month:    '月',
            			week:     '週',
            			day:      '日'
        		},
 
	        	// 月名称
        		monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
	        	// 月略称
        		monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
	        	// 曜日略称
        		dayNames: ['日', '月', '火', '水', '木', '金', '土'],
        		dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
			//more表示の書式
			dayPopoverFormat:'YYYY年 M月 D日[(]ddd[)]',

			//AM PM入れない
		        timeFormat: 'T',	//AM PM
		        //timeFormat: '',	//AM PM

		        // 列の書式
        		columnFormat: {
            			month: 'ddd',    // 月
            			week:  'DD日[(]ddd[)]', // 7(月)
            			day:   'DD日[(]ddd[)]'    // 7(月)
        		},
 
			/* 
	       		// イベントソース（例）
        		eventSources: [
            		{
                		events: [
                    		{
                       			title: 'event1',
                        		start: '2015-11-01',
					color: 'yellow',   // an option!
	    				textColor: 'black' // an option!
                    		},
                    		{
                       			title: 'event2',
                        		start: '2015-11-02',
                        		end: '2015-11-03',
					color: 'red',   // an option!
	    				textColor: 'white' // an option!
                    		},
                    		{
                       			title: 'event3',
                        		start: '2015-11-05 12:30:00',
                        		allDay: false // will make the time show
                    		}
                		],
            		}
        		],
			*/

			//イベントのクリック
			eventClick : function(event){
				selectEvent(event.id);
			},

			//日のクリック
			/*
			dayClick : function(){
				//alert("day click");
				var moment = $('#calendar').fullCalendar('getDate');
				//alert(moment.format('YYYY-M-D'));
				$('#calendar').fullCalendar('gotoDate',moment.format('YYYY-M-D'));
				$('#calendar').fullCalendar('changeView','basicDay');
			},
			*/
			//イベントの最大表示数
    			eventLimit: true,
    			views: {
        			agenda: {
            				eventLimit: 1
        			}
    			},
			//eventLimitText: '件あり',
			eventLimitText: '件',

			//eventLimitClick : 'popover',
			//eventLimitClick : 'day',

			eventLimitClick : function(cellInfo){
				//var date = cellInfo.date;
				var date = $.fullCalendar.moment(cellInfo.date);

				/* 指定日タイトルがスクロールする
				var formDate = date.format('YYYY/MM/DD');
				LimitEvent(formDate);
				*/
				
				//day 表示になる	
				var elm = $('#calendar');
				elm.fullCalendar('gotoDate', date );

				$('.fc-myCustomMonth-button').css({'visibility':'visible'});

				elm.fullCalendar('changeView','basicDay');
				
			},

/*			eventLimitClick: function(cellInfo,jsEvent) {

				//scrollTo(0,1);

				var row = jsEvent.pageX;
				var col = jsEvent.pageY;
				var moreLink = cellInfo.moreEl;
				//var segs = cellInfo.hiddenSegs;
				var segs = cellInfo.segs;

				var FC = $.fullCalendar;
				var DayGrid = FC.DayGrid;
				var CustomClick;

				  
				

				//fullcalendar/src/common/DayGrid.limit.js
				//***************************
				//row, col, moreLink, segs

				function(row, col, moreEL, reslicedAllSegs) {

				var _this = $('#calendar').fullCalendar;	//this;
				var view  = _this.view;		//this.view;
alert(view);
				var moreWrap = moreLink.parent();

				// the <div> wrapper around the <a>
				var topEl;
				// the element we want to match the top coordinate of
				var options;

				if (this.rowCnt == 1) {
					topEl = view.el;
					// will cause the popover to cover any sort of header
				}else {
					topEl = this.rowEls.eq(row);
					// will align with top of row
				}

				options = {
					className: 'fc-more-popover',
					content: this.renderSegPopoverContent(row, col, segs),
					parentEl: this.el,
					top: topEl.offset().top,
					autoHide: true, // when the user clicks elsewhere, hide the popover
					viewportConstrain: view.opt('popoverViewportConstrain'),
					hide: function() {
						// kill everything when the popover is hidden
						_this.segPopover.removeElement();
							_this.segPopover = null;
						_this.popoverSegs = null;
					}
				};

				// Determine horizontal coordinate.
				// We use the moreWrap instead of the <td> to avoid border confusion.
				if (this.isRTL) {
					options.right = moreWrap.offset().left + moreWrap.outerWidth() + 1; // +1 to be over cell border
				}else {
					options.left = moreWrap.offset().left - 1; // -1 to be over cell border
				}

				this.segPopover = new Popover(options);
				this.segPopover.show();
				//}
				//***************************

			},
*/

		});

		//イベント情報の設定（eventArrayへのデータ設定完了までの十分な時間を確保する）
		//setTimeout("eventSetCalendar()" , 2000);

		//callback化
		readEvents(0 , function(){
			//eventSetCalendar();
			//callback化
			eventSetCalendar(function(){
				TodayEvent();
			});
		});
	});
}

//非表示のカレンダーを表示にする
function showCalendar(){
	$("#calendar").css({
		"display" : "block"
	});

	$("#showBlock").css({
		"display" : "none"
	});
}

//**** for inquiry.html *******
var inquiryArray  = new Array();	//相談用配列（２次元：連想配列）

//相談ごとの選択 アコーディオン機能
var openInq = "";
function inqScroll(callInq){
	
	//スクロール量の計算
	//var targetY  = $(callInq).offset().top;	//コンテンツの現在位置
	//targetY -= $(callInq + "_title").height();	//タイトルの高さ減算
	var targetY = $(callInq + "_title").offset().top;	//タイトルの現在位置
	targetY -= $("#menu-back").height(); 		//メニューバックの高さ減算
	//targetY -= 18;					//調整減算（原因未追求）

	//スクロール実施
	$("html,body").animate({scrollTop:targetY},{duration: 1000});

}

function selectInquiry(idno){
	var callInq = '#inqid_' + idno;

	if(openInq != ""){
		//イベント詳細が開いている場合は、閉じてから次のオープンに進む
		$(openInq).hide("blind" , "" , 200 ).promise().done(function(){

			if(openInq == callInq || idno == 0){
				openInq = "";

				//topに戻る
				var targetY = 0;
				$("html,body").animate({scrollTop:targetY},{duration: 1000});
			}else{
				$(callInq).show("blind", "", 500 );
				openInq = '#inqid_' + idno;

				inqScroll(openInq);

			}

		});	
	}else{
		//イベント詳細が開いていない場合
		$(callInq).show("blind", "", 1000 );
		openInq = '#inqid_' + idno;

		inqScroll(openInq);
	}
}

//inquiry（相談）ファイルを読み込みinquiryArrayに保存
function readInquiry(table){
	csvToArray( table , function(data) {

		//1行目をフィールド名として扱い連想配列にする
		for(var i = 1 ; i < data.length ; i++){
			var rensou = new Object();
			for(var s = 0; s < data[i].length ; s++){
				rensou[data[0][s]] = data[i][s]; 
			}
			inquiryArray.push(rensou);
		}

		//そのままデータセット
		inquirySetData();

		//googlemap の初期設定
		mapInit();
	});
}

//inquiry別のデータ分類
//inquiry table のデータは、カテゴリ単位に表示順にソートしておくこと
//***** 変換テーブル *******
var inq_cat1  = "category1";
var inq_cat2  = "category2";
var inq_name  = "name";
var inq_phone = "phone";
var inq_mail  = "mail";
var inq_addr  = "address";
var inq_memo  = "memo";
var inq_open  = "open";
var inq_close = "close";
var inq_url   = "url";
var inq_lat   = "lat";
var inq_lng   = "lng";

var maplink   = "<img src='images/maplink.png' height='20px' ";

function inquirySetData(){
	var ary = inquiryArray;
	var len = inquiryArray.length;

	//category 1 は、５つが前提（settingでの決めが必要）
	//var max_cat1 = 5;
	var max_cat1 = 1;

	//*****************

	if(len > 0){
		//スタートのカテゴリ
		var cat1 = ary[0][inq_cat1];
		var cat2 = ary[0][inq_cat2];
		var now_id = 1;
		var buff = "";
		var cat1_f = 0;
		var cat2_f = 0;
	}else{
		return false;
	}

	for(var i = 0 ; i < len ; i++){

		/*//********
		if(now_id > max_cat1){
			//return false;
		}
		//********
		*/

		if(cat1_f == 0){
			//buff += "<h3>" + ary[i][inq_cat1] + "</h3>";
			cat1_f = 1;
		}
		if(cat2_f == 0){
			buff += "<h4>" + ary[i][inq_cat2] + "</h4>";
			cat2_f = 1;
		}

		//max_cat1 を超えた場合はスルー


		//
		buff += "<h4 class='inq_name'>" + ary[i][inq_name] + "</h4>";

		if(ary[i][inq_phone] != ""){
			//電話発信機能 電話番号のチェック
			var teldata = telNumber(ary[i][inq_phone]);
			if(teldata == -1 ){
				buff += ary[i][inq_phone] + "<br />";
			}else{
				buff += "<a href='tel:" + teldata + "' >" + ary[i][inq_phone] + "<a><br />";
			}
		}

		if(ary[i][inq_addr] != ""){
			buff += ary[i][inq_addr];
		}

		//位置情報がある場合　名前をボタンに表示しマップ起動可能とする
		if(ary[i][inq_lat] != "" && ary[i][inq_lng] != ""){
			//buff += "<input class='inq_map' type='button' onClick='inquiryMap_visible(" + i + ")' value='地図' ><br />";
			buff += "　" + maplink + " onClick='inquiryMap_visible(" + i + ")' /><br />";

		}else{
			buff += "<br />";
		}

		if(ary[i][inq_mail] != ""){
			buff += ary[i][inq_mail] + "<br />";
		}

		if(ary[i][inq_open] != ""){
			buff += "開館：" + ary[i][inq_open] + "<br />";
		}

		if(ary[i][inq_close] != ""){
			buff += "休館：" + ary[i][inq_close] + "<br />";
		}

		if(ary[i][inq_memo] != ""){
			buff += ary[i][inq_memo] + "<br />";
		}

		if(ary[i][inq_url] != ""){
			buff += "<a href='" + ary[i][inq_url] + "' target='_blank'>" + ary[i][inq_url] + "</a><br />";
		}
		//

		if(i < (len -1)){

			if(cat1 == ary[i+1][inq_cat1]){
				if(cat2 != ary[i+1][inq_cat2]){
					cat2 = ary[i+1][inq_cat2];
					cat2_f = 0;
				}
			}else{
				//カテゴリが変わったらデータを書き出し
				$('#inqid_' + now_id + '_cont').html(buff);

				//各種フラグ更新
				cat1 = ary[i+1][inq_cat1];
				cat2 = ary[i+1][inq_cat2];
				cat1_f = 0;
				cat2_f = 0;
				now_id++;
				buff = "";
			}
		}

		buff += "<br />";
	}
	$('#inqid_' + now_id + '_cont').html(buff);

/*
	//****試験運用中*****
	for(var s = 2 ; s <= 5 ; s++){
		$('#inqid_' + s + '_cont').html("<center><img src='images/notalone_symbol.png'>ただいま準備中です。<br />しばらくお待ち下さい。</center>");
	}
	//*****************
*/
}

//function inquiryMap_visible(nlat,nlng){
function inquiryMap_visible(locationNo){
	//location位置情報
	var nlat = inquiryArray[locationNo][inq_lat];
	var nlng = inquiryArray[locationNo][inq_lng];
	var latlng = new google.maps.LatLng(nlat , nlng);

	//******
	var html = "<h5>";
	html += inquiryArray[locationNo][inq_name];
	//html += "<br />";
	//html += locationArray[locationNo][inq_memo];
	html += "</h5>";

        now_infowindow.setContent(html);
	//******

	now_marker.setPosition(latlng);
	mapCanvas.setCenter(latlng);

	$('#map_area').css('visibility' , 'visible');
}

function inquiryMap_hidden(){
	//openInfoWindow close
        now_infowindow.close();

	$('#map_area').css('visibility' , 'hidden');
}


//******* about.html *****
function selectAbout(idno){
	var callInq = '#aboutid_' + idno;

	if(openInq != ""){
		//イベント詳細が開いている場合は、閉じてから次のオープンに進む
		$(openInq).hide("blind" , "" , 200 ).promise().done(function(){

			if(openInq == callInq || idno == 0){
				openInq = "";

				//topに戻る
				var targetY = 0;
				$("html,body").animate({scrollTop:targetY},{duration: 1000});
			}else{
				$(callInq).show("blind", "", 500 );
				openInq = '#aboutid_' + idno;

				inqScroll(openInq);
			}

		});	
	}else{
		//イベント詳細が開いていない場合
		$(callInq).show("blind", "", 1000 );
		openInq = '#aboutid_' + idno;

		inqScroll(openInq);
	}
}


//*********** common ****************

//CSVファイルの読み込み
function csvToArray(filename, cb) {
	//キャッシュしない
	$.ajaxSetup({
		cache: false
	});

	$.get(filename, function(csvdata) {
		//CSVのパース作業
		//CRの解析ミスがあった箇所を修正しました。
		//以前のコードだとCRが残ったままになります。
		// var csvdata = csvdata.replace("\r/gm", ""),
		csvdata = csvdata.replace(/\r/gm, "");

		var line = csvdata.split("\n"),
		ret = [];
		for (var i in line) {
        		//空行はスルーする。
        		if (line[i].length == 0) continue;

        		var row = line[i].split(",");
        		ret.push(row);
      		}
      		cb(ret);
	});
}


//setting ファイルを読み込み settingArrayに保存
function readSettingData(table , callback){
	csvToArray( table , function(data) {

		settingArray = new Array();

		//1行目をフィールド名として扱い連想配列にする
		for(var i = 1 ; i < data.length ; i++){
			var rensou = new Object();
			for(var s = 0; s < data[i].length ; s++){
				rensou[data[0][s]] = data[i][s]; 
			}
			settingArray.push(rensou);
		}
		callback(settingArray);
	});
}

//settingArrayから、フィールド名のデータを読み出す
function getSetting(fieldname){
	var data = settingArray;
 
	for(var i = 0 ; i < data.length ; i++){
		if(data[i]['define'] == fieldname){
			return data[i]['data'];
			break;
		}
	}
	return false;
}

//電話番号のチェック
function telNumber(txt){
	var txt0 = txt;

	// -- () を削除して評価する
	var txt1 = txt0.replace(/-/g, '');
	var txt2 = txt1.replace(/\(/g, '');
	var number = txt2.replace(/\)/g, '');

	//data1 = txt.match(/^[0-9-]{6,9}$|^[0-9-]{12}$/);
	//data2 = txt.match(/^\d{1,4}-\d{4}$|^\d{2,5}-\d{1,4}-\d{4}$/);
	data1 = number.match(/^[0-9-]{9,12}$/);

	//if(!data1 && !data2){
	if(!data1){
		//alert(number + "　電話番号が不正です");
		return -1;
	}else if(number.substr(0,1) == "0"){
		//alert(number);
		return number;
	}else{
		//alert(number + "　0がありません");
		return -1;
	}
}

//URLのチェック
function urlStrings(txt){

	//return -1;

	data1 = txt.match(/^(http|ftp):\/\/.+$/);
	data2 = txt.match(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/);

	if(!data1 && !data2){
		//alert("URLが不正です");
		return -1;
	}else{
		return 1;
	}
}


