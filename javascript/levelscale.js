(function () {
	document.documentElement.style.fontSize = document.documentElement.clientHeight/6.67+'px';
	var oBody = document.getElementsByTagName('body')[0];
	var oDownload = document.getElementsByClassName('download')[0];
	var oCover = document.getElementsByClassName('cover');	//三关各自的遮罩
	oBody.style.height = document.documentElement.clientHeight+"px";
	oDownload.style.width = document.documentElement.clientWidth+"px";
	for(var i=0;i<(oCover.length);i++)
	{
		oCover[i].style.width = document.documentElement.clientWidth+"px";
		oCover[i].style.height = (document.documentElement.clientHeight-oDownload.offsetHeight)+"px";
	}
	
	var oContent = document.getElementsByClassName('content');//三关游戏主体，长度为3
	var oSign2 = document.getElementsByClassName('sign2');
	var oLevel = document.getElementsByClassName('level');
	var oAgain = document.getElementsByClassName('again')[0];//重放题目
	var oGamechange = document.getElementsByClassName('gamechange')[0];//换题目
	var oNext = document.getElementsByClassName('next');
	var oWarning = document.getElementsByClassName('warning')[0];
	var oTimecount = document.getElementsByClassName('timecount')[0];
	var oGametime = document.getElementsByClassName('gametime');
	var oTotaltime = document.getElementsByClassName('totaltime')[0];
	var aSampleLi = new Array();//题目音热区
	var aSampleSpan = new Array();//题目音span
	var aLi = new Array();//热区
	var aSpan = new Array();//变色区
	var aAudio = new Array();//音频
	var aListen = new Array();//题目示例音频
	var aChosen = new Array();//用户选择的音
	var answerflag = new Array();//答案正确与否标志，0为错误，1为正确
	var leveltime = new Array();//每一关所用时间记录
	var levelFlag = 0;//关卡指示,指示当前页面为第几关
	var listenflag = 0;//答案正确与否标志，0为有错误，1为全部正确
	var timeflag = 0;//时间统计标志，0为还未按下第一个键，1为已经按下第一个键了
	var timer = null;
	var firstkill = 0;//第一关是否第一个按键就对，0为不对，1为对
	// var scoreflag = 0;//0表示未显示成绩，1表示已经显示过成绩了
	setTimeout(function(){
		levelFlag = 0;
		gameInit();
		play();
	},3000)
	function gameInit(){
		//题目初始化，随机生成题目
		for(var i=0;i<3;i++)
		{
			aListen[i] = new Array();
			aChosen[i] = new Array();
			answerflag[i] = new Array();
			for(var j=0;j<(i*2+1);j++)
			{
				answerflag[i][j] = 0;
				if(i != 2)
				{
					aListen[i][j] = Math.floor(Math.random()*5+j*5);
				}
				else
				{
					aListen[i][j] = Math.floor(Math.random()*8+j*8);
				}
			}
		}
	}
	function play() {
		var i = 0;
		var playtimer = setInterval(function(){
			if(i != aListen[levelFlag].length)
			{
				//不同关卡不同的音符长度
				aAudio[levelFlag][aListen[levelFlag][i]].play();
				i++;
			}
			else
			{
				clearInterval(playtimer);
			}
		},500);
		
	}
	
	for(var i=0;i<(oLevel.length);i++)
	{
		//将每一关的li(热区)、span（变色区）和audio（音频）放入aLi、aSpan和aAudio数组里
		aLi[i] = oLevel[i].getElementsByTagName('li');
		aSpan[i] = oLevel[i].getElementsByTagName('span');
		aAudio[i] = oLevel[i].getElementsByTagName('audio');
		if(i == 0)
		{
			aSampleLi[i] = new Array();
			aSampleLi[i][0] = oSign2[i].getElementsByTagName('li')[2];
		}
		else
		{
			aSampleLi[i] = oSign2[i].getElementsByTagName('li');
		}
	}
	for(var m=0;m<(aLi.length);m++)
	{
		for(var n=0;n<(aLi[m].length);n++)
		{
			aLi[m][n].addEventListener("click", liclick(m,n), false);
		}
	}
	function liclick (m,n) {
		//m指示第几关，n指示第几个
		return function(){
			if(timeflag == 0)
			{
				//开始计时
				start = Date.now();
				oWarning.innerHTML = "还不是正确答案，请继续加油！";
				timeflag++;
				clearInterval(timer);
				timer = setInterval(function(){
					var temp = Date.now();
					var temptime = Math.floor((temp-start)%1000);
					var sumsecond = Math.floor((temp-start)/1000);
					var minute = Math.floor(sumsecond/60);
					var second = Math.floor(sumsecond%60);
					var mm = Math.floor((temptime*60)/1000);
					minute = minute>9?minute:"0"+minute;
					second = second>9?second:"0"+second;
					mm = mm>9?mm:"0"+mm;
					oTimecount.innerHTML = minute+":"+second+":"+mm;
				},1);
			}
			if(m == 2)
			{
				//如果是第三关，则一列8个音
				i = 8;
			}
			else
			{
				//如果不是第三关，则一列5个音
				i = 5;
			}1
			var group = Math.floor(n/i);
			for(var k=group*i;k<(group+1)*i;k++)
			{
				//将该组的其他选项框改为白底红框
				aSpan[m][k].style.backgroundColor = "#F9F8F3";
				aSpan[m][k].style.borderColor = "#F15454";
			}
			aAudio[m][n].play();
			aSpan[m][n].style.backgroundColor = "#F15454";

			aChosen[m][group] = n;
			if(aListen[m][group] == n)
			{
				answerflag[m][group] = 1;
			}
			else{
				answerflag[m][group] = 0;
			}
			listenflag = 1;
			for(var p=0;p<(m*2+1);p++)
			{
				if(answerflag[m][p] == 0)
				{
					listenflag = 0;
				}
			}
			if(listenflag == 1)
			{
				stop = Date.now();
				clearInterval(timer);
				timeflag = 0;
				oWarning.innerHTML = "";
				if(m == 0)
				{
					if(firstkill == 0)
					{
						//如果第一关按第一个音就正确，则用时0秒
						leveltime[0] = 0;
						oGametime[m].innerHTML = "第一关用时0秒！";
					}
					else
					{
						leveltime[0] = (stop-start)/1000;
						oGametime[m].innerHTML = "第一关用时" + ((stop-start)/1000).toFixed(3) + "秒！";
					}
					
				}
				else if(m == 1){
					leveltime[1] = (stop-start)/1000;
					oGametime[m].innerHTML = "第二关用时" + ((stop-start)/1000).toFixed(3) + "秒！";
				}
				else
				{
					leveltime[2] = (stop-start)/1000;
					oGametime[m].innerHTML = "第三关用时" + ((stop-start)/1000).toFixed(3) + "秒！";
					oTotaltime.innerHTML = "三关时间总计" + (leveltime[0]+leveltime[1]+leveltime[2]).toFixed(3) + "秒！";
					console.log(leveltime);
				}
				oCover[levelFlag].style.display = "block";
				for(var i=0;i<(m*2+1);i++)
				{
					aSpan[m][aListen[m][i]].style.backgroundColor = "#30A080";
					aSpan[m][aListen[m][i]].style.borderColor = "#30A080";
				}
			}
			firstkill = 1;
		}
	}
	for(var m=0;m<aSampleLi.length;m++)
	{
		for(var n=0;n<aSampleLi[m].length;n++)
		{
			aSampleLi[m][n].addEventListener("click", sampleclick(m,n), false);
		}
	}
	function sampleclick(m,n){
		return function(){
			aAudio[m][aListen[m][n]].play();
		}
	}
	oAgain.onclick = function(){
		play();
	}
	oGamechange.onclick = function(){
		gameInit();
		play();
		for(var i=0;i<aLi[levelFlag].length;i++)
		{
			aSpan[levelFlag][i].style.borderColor = "#F15454";
			aSpan[levelFlag][i].style.backgroundColor = "#F9F8F3";
		}
	}
	function levelChange() {
		//跳到下一关
		oTimecount.innerHTML = "00:00:00";
		startMove(oContent[levelFlag],{left: (-1300-levelFlag*300)},15,function(){
			oContent[levelFlag].style.display = "none";
			oContent[levelFlag].style.left = 0 + "rem";
			oContent[levelFlag].style.opacity = 0;
			for(var i=0;i<aLi[levelFlag].length;i++)
			{
				aSpan[levelFlag][i].style.borderColor = "#F15454";
				aSpan[levelFlag][i].style.backgroundColor = "#F9F8F3";
			}
			levelFlag++;
			if(levelFlag == 3)
			{
				gameInit();
				firstkill = 0;
				levelFlag = 0;
			}
			oContent[levelFlag].style.display = "block";
			startMove(oContent[levelFlag],{opacity: 100},35,function(){
				play();
			});
		});
	}
	function gameNext() {
		oCover[levelFlag].style.display = "none";
		levelChange();
	}
	for(var i=0;i<oNext.length;i++)
	{
		oNext[i].addEventListener("click", gameNext, false);
	}
	
})();