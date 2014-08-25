function TrainCheck(){
	var signalId, pauseId, sound = true, neededNumber = "106";
	this.start = function(interval, trainNumber){
		if (trainNumber) {neededNumber = trainNumber};
		pauseId = setInterval(searchAndCheck, interval);
	}
	this.stop = function(){
		clearInterval(pauseId);
		clearInterval(signalId);
	}
	this.mute = function(){
		sound = false;
		clearInterval(signalId);
		console.log("stopping " + signalId);
	}
	this.alarm = function(){
		sound = true;
	}
	searchAndCheck = function(){
		console.log(">>> check at: " + new Date());
		var signalCount=0;
		Common.ajax(GV.page.module + '/search/', { form: frmSearch._form }, function (resp) {
			if (resp.error) {
				if (!Helper.limitError(resp, frmSearch._onSubmit))
					trains.error(resp.value);
			} else {
				trains.show(resp.value);
				for(i=0;i<resp.value.length;i++){
					var poezd=resp.value[i]; 
					if(poezd.num.indexOf(neededNumber)>=0){
						for(var vagonIdx=0;vagonIdx<poezd.types.length;vagonIdx++){
							if(poezd.types[vagonIdx].title === "Купе"){
								console.log("\t--- match at: "+ new Date());
								if(sound){
									signalId=setInterval(function(){
										var audio = new Audio('http://www.freesound.org/data/previews/213/213671_1979597-lq.mp3');
										audio.play();
										++signalCount >=5 && clearInterval(signalId);
									}, 8000);
									console.log(signalId+ " has been started");
								}
							}
						}
					}
				}
			}
		});
	}
};
var tc = new TrainCheck();
tc.start(30000, "024");