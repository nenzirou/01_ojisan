enchant();

window.onload = function () {
	var game = new Game(400, 500);  		//画面サイズを400*500にする。（このサイズだとスマホでも快適なのでおススメ）

	//結果ツイート時にURLを貼るため、このゲームのURLをここに記入
	var url = "http://nenzirou.html.xdomain.jp/ojisan/index.html";
	url = encodeURI(url); //きちんとURLがツイート画面に反映されるようにエンコードする
	/////////////////////////////////////////////////
	//ゲーム開始前に必要な画像・音を読み込む部分

	//クリック音読み込み
	var ClickSound = "click.wav";			//game.htmlからの相対パス
	game.preload([ClickSound]); 			//データを読み込んでおく
	var CoinSound = "coin.wav";
	game.preload([CoinSound]);

	//おじさん画像
	var OjiImg = "ozi.png";					//game.htmlからの相対パス
	game.preload([OjiImg]);					//データを読み込んでおく
	var OjiRight = "oziRight.png";
	game.preload([OjiRight]);
	var OjiLeft = "oziLeft.png";
	game.preload([OjiLeft]);

	// 街並み画像
	var TownImg = "mati.png";
	game.preload([TownImg]);
	var TownImg2 = "mati2.png";
	game.preload([TownImg2]);
	var TownImg3 = "mati3.png";
	game.preload([TownImg3]);

	// 	うんち画像
	var UntiImg = "unchi.png";
	game.preload([UntiImg]);

	// コイン画像
	var CoinImg = "coin.png";
	game.preload([CoinImg]);

	// ポーズボタン
	var PauseImg = "Pause.png";
	game.preload([PauseImg]);

	//リトライボタン
	var B_Retry = "Retry.png";				//game.htmlからの相対パス
	game.preload([B_Retry]);				//データを読み込んでおく

	//ツイートボタン
	var B_Tweet = "Tweet.png";				//game.htmlからの相対パス
	game.preload([B_Tweet]);				//データを読み込んでおく

	//読み込み終わり
	/////////////////////////////////////////////////


	game.onload = function () {					//ロードが終わった後にこの関数が呼び出されるので、この関数内にゲームのプログラムを書こう

		/////////////////////////////////////////////////
		//グローバル変数 定義
		var Point = 0;								//ポイント
		var State = 0;								//現在のゲーム状態
		var Spornx = 20;
		var Sporny = 460;
		var Cnt = 0;
		var JumpCnt = 0;
		var jump = false;
		var death = false;
		var untiSpeed = 0;
		var animeSpeed = 10;
		var jumpTime = 0;
		var jumpSpeed = 0;
		var coinSpeed = 0;
		//グローバル変数終わり
		/////////////////////////////////////////////////

		var S_MAIN = new Scene();					//シーン作成
		game.pushScene(S_MAIN);  					//S_MAINシーンオブジェクトを画面に設置
		S_MAIN.backgroundColor = "black"; 			//S_MAINシーンの背景は黒くした

		// 街ボタン
		var Town1 = new Sprite(500, 508);
		Town1.moveTo(0, 0);
		Town1.image = game.assets[TownImg];
		S_MAIN.addChild(Town1);
		Town1.ontouchend = function () {				//街ボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			if (!jump && State == 1) jump = true;
			game.assets[ClickSound].clone().play();		//クリックの音を鳴らす。
		};

		// 街ボタン
		var Town2 = new Sprite(500, 508);
		Town2.moveTo(500, 0);
		Town2.image = game.assets[TownImg];
		S_MAIN.addChild(Town2);
		Town2.ontouchend = function () {				//街ボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			if (!jump && State == 1) jump = true;
			game.assets[ClickSound].clone().play();		//クリックの音を鳴らす。
		};

		//おじさんボタン
		var Oji = new Sprite(20, 40);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		Oji.moveTo(Spornx, Sporny);					//ぞう山ボタンの位置
		Oji.image = game.assets[OjiImg];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_MAIN.addChild(Oji);						//S_MAINにこのぞう山画像を貼り付ける
		Oji.ontouchend = function () {					//ぞう山ボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			if (!jump && State == 1) jump = true;
			game.assets[ClickSound].clone().play();		//クリックの音を鳴らす。
		};

		//うんちボタン
		var Unti = new Sprite(50, 42);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		Unti.moveTo(Spornx + 500, Sporny - 2);					//ぞう山ボタンの位置
		Unti.image = game.assets[UntiImg];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_MAIN.addChild(Unti);						//S_MAINにこのぞう山画像を貼り付ける
		Unti.ontouchend = function () {					//ぞう山ボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			if (!jump && State == 1) jump = true;
			game.assets[ClickSound].clone().play();		//クリックの音を鳴らす。
		};

		// コインボタン
		var Coin = new Sprite(40, 40);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		Coin.moveTo(Spornx + 500, Sporny);					//ぞう山ボタンの位置
		Coin.image = game.assets[CoinImg];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_MAIN.addChild(Coin);						//S_MAINにこのぞう山画像を貼り付ける
		Coin.ontouchend = function () {					//ぞう山ボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			if (!jump && State == 1) jump = true;
			game.assets[ClickSound].clone().play();		//クリックの音を鳴らす。
		};

		// ポーズボタン
		var Pause = new Sprite(120, 60);
		Pause.moveTo(270, 10);						//ポーズボタンの位置
		Pause.image = game.assets[PauseImg];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_MAIN.addChild(Pause);						//S_ENDにこのリトライボタン画像を貼り付ける
		Pause.ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			if (State < 10) State = 10;
			else State = 1;
		};

		//ポイント表示テキスト
		var S_Text = new Label(); 					//テキストはLabelクラス
		S_Text.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		S_Text.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		S_Text.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_Text.moveTo(0, 30);						//移動位置指定
		S_MAIN.addChild(S_Text);					//S_MAINシーンにこの画像を埋め込む
		S_Text.text = "現在：" + Point + "m";		//テキストに文字表示 Pointは変数なので、ここの数字が増える

		///////////////////////////////////////////////////
		//メインループ　ここに主要な処理をまとめて書こう
		game.onenterframe = function () {
			if (State == 0) { 						//State=0のとき、初期セット状態(Pointの状態を０にして)
				Oji.y = Sporny;						//ぞう山のy座標を指定
				Unti.x = 600;
				Coin.x = 1000;
				Point = 0;  						//point初期化
				State = 1;							//ゲームスタート状態に移行
				Cnt = 0;
				JumpCnt = 0;
				jump = false;
				death = false;
				untiSpeed = 10;
				animeSpeed = 10;
				jumpSpeed = 12;
				jumpTime = 12;
				coinSpeed = 6;
				Town1.image = game.assets[TownImg];
				Town2.image = game.assets[TownImg];

			} else if (State == 1) {
				// 時間のカウント
				if (!death) {
					Cnt++;
					if (Cnt % 3 == 0) Point++;
				}

				//現在のテキスト表示
				S_Text.text = "現在：" + Point + "m"; 		//Point変数が変化するので、毎フレームごとにPointの値を読み込んだ文章を表示する

				// 背景を動かす
				Town1.x--;
				Town2.x--;
				if (Town1.x <= -500) Town1.x = 500;
				if (Town2.x <= -500) Town2.x = 500;
				if (Point >= 750 && Point <= 1500) {
					Town1.image = game.assets[TownImg2];
					Town2.image = game.assets[TownImg2];
				} else if (Point >= 3000) {
					Town1.image = game.assets[TownImg3];
					Town2.image = game.assets[TownImg3];
				}

				// おじさんのアニメーション
				if (Cnt % 300 == 0) {
					animeSpeed--;
					if (animeSpeed <= 2) animeSpeed = 2;
				}

				if (Cnt % animeSpeed * 4 <= animeSpeed - 1) Oji.image = game.assets[OjiRight];
				else if (Cnt % animeSpeed * 4 <= animeSpeed * 2 - 1) Oji.image = game.assets[OjiImg];
				else if (Cnt % animeSpeed * 4 <= animeSpeed * 3 - 1) Oji.image = game.assets[OjiLeft];
				else Oji.image = game.assets[OjiImg];

				// うんちを動かす
				Unti.x -= untiSpeed;
				if (Unti.x <= -50) Unti.x = 400 + Math.floor(Math.random() * 500);
				if (Cnt % 300 == 0) {
					untiSpeed++;
					if (untiSpeed >= 20) untiSpeed = 20;
				}

				// コインを動かす
				Coin.x -= coinSpeed;
				if (Coin.x <= -40) {
					Coin.x = 400 + Math.floor(Math.random() * 1000);
					Coin.y = 300 + Math.floor(Math.random() * 150);
				}
				if (Oji.intersect(Coin) && !death) {
					Coin.x = 400 + Math.floor(Math.random() * 1000);
					Coin.y = 300 + Math.floor(Math.random() * 150);
					Point += 50;
					game.assets[CoinSound].clone().play();
				}

				// ジャンプ
				if (jump) {
					JumpCnt++;
					if (JumpCnt <= jumpTime) Oji.y -= jumpSpeed;
					else Oji.y += jumpSpeed;
					if (JumpCnt >= jumpTime * 2) {
						jump = false;
						JumpCnt = 0;
					}
				}

				//ゲームオーバー判定
				if (Oji.within(Unti, 15)) {				//画面端にぞう山画像が行ってしまったら
					game.popScene();					//S_MAINシーンを外す
					game.pushScene(S_END);				//S_ENDシーンを読み込ませる
					death = true;

					//ゲームオーバー後のテキスト表示
					S_GameOverText.text = "GAMEOVER 記録：" + Point + "m";				//テキストに文字表示
					if (Point <= 100) {
						S_GameOverText.text += "　ケツアマチュア"
					} else if (Point <= 250) {
						S_GameOverText.text += "　凡人のケツ"
					} else if (Point <= 500) {
						S_GameOverText.text += "　できるケツ"
					} else if (Point <= 750) {
						S_GameOverText.text += "　有能なケツ"
					} else if (Point <= 1000) {
						S_GameOverText.text += "　プロのケツ"
					} else if (Point <= 1250) {
						S_GameOverText.text += "　職人技のケツ"
					} else if (Point <= 1500) {
						S_GameOverText.text += "　社長みたいなケツ"
					} else if (Point <= 2000) {
						S_GameOverText.text += "　無敵のケツ"
					} else if (Point <= 2500) {
						S_GameOverText.text += "　人類史上稀に見るケツ"
					} else if (Point <= 3000) {
						S_GameOverText.text += "　宇宙を感じさせるケツ"
					} else if (Point <= 4000) {
						S_GameOverText.text += "　ブラックホールみたいなケツ"
					} else if (Point <= 5000) {
						S_GameOverText.text += "　ケツの中のケツ"
					} else if (Point <= 7500) {
						S_GameOverText.text += "　唯一神に認められたケツ"
					} else if (Point <= 10000) {
						S_GameOverText.text += "　ケツを知り尽くしたケツのケツによるケツのためのケツ"
					} else S_GameOverText.text += "　ケツを核融合することによって発生するケツ・オメガ・レクイエムを覚醒させるために必要なスキルを身に着けたおっさんによるケツ破壊活動を食い止めるべく立ち上がったケツアナルマンは君だったんだ（確信）"
				}
			}
		};


		////////////////////////////////////////////////////////////////

		//結果画面
		S_END = new Scene();
		S_END.backgroundColor = "blue";

		//GAMEOVER
		var S_GameOverText = new Label(); 					//テキストはLabelクラス
		S_GameOverText.font = "20px Meiryo";				//フォントはメイリオ 20px 変えたかったらググってくれ
		S_GameOverText.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　今回は白
		S_GameOverText.width = 400;							//横幅指定　今回画面サイズ400pxなので、width:400pxだと折り返して二行目表示してくれる
		S_GameOverText.moveTo(0, 30);						//移動位置指定
		S_END.addChild(S_GameOverText);						//S_ENDシーンにこの画像を埋め込む

		//リトライボタン
		var S_Retry = new Sprite(120, 60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		S_Retry.moveTo(50, 300);						//リトライボタンの位置
		S_Retry.image = game.assets[B_Retry];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_END.addChild(S_Retry);						//S_ENDにこのリトライボタン画像を貼り付ける

		S_Retry.ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			State = 0;
			game.popScene();							//S_ENDシーンを外す
			game.pushScene(S_MAIN);						//S_MAINシーンを入れる
		};

		//ツイートボタン
		var S_Tweet = new Sprite(120, 60);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		S_Tweet.moveTo(230, 300);						//リトライボタンの位置
		S_Tweet.image = game.assets[B_Tweet];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		S_END.addChild(S_Tweet);						//S_ENDにこのリトライボタン画像を貼り付ける

		S_Tweet.ontouchend = function () {				//S_Tweetボタンをタッチした（タッチして離した）時にこの中の内容を実行する
			//ツイートＡＰＩに送信

			window.open("http://twitter.com/intent/tweet?text=" + Point + "mのところでおじさんはう●ちに飲み込まれた&url=" + url);
		};

	};

	game.start();
};