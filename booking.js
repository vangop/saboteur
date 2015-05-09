function TrainCheck(){
	var signalId=0, pauseId, sound = true, neededNumber = "106";
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
	checkVagonIsComfortable = function(poezd){


	}
	checkTrainNumber = function(t){
		return t.num.indexOf(neededNumber)>=0;
	}
	processVagons = function(train){
		var signalCount=0;
		console.log(train.coaches);
		for(var i=0;i<train.coaches.length;i++){
			var vagon=train.coaches[i];
			if(vagon.num >=3 && vagon.num<=14){
				if(sound){
					signalId>0 && clearInterval(signalId);
					signalId=setInterval(function(){
						var audio = new Audio('http://www.freesound.org/data/previews/213/213671_1979597-lq.mp3');
						audio.play();
						++signalCount >=5 && clearInterval(signalId);
					}, 8000);
					console.log(signalId+ " has been started");
				}
				break;
			}
		}
	}
	searchAndCheck = function(){
		console.log(">>> check at: " + new Date());
		var signalCount=0;
        trains = new TTrains();

		Common.ajax(GV.page.module + '/search/', { form: frmSearch._form }, function (resp) {
			if (resp.error) {
				if (!Helper.limitError(resp, frmSearch._onSubmit))
					trains.error(resp.value);
			} else {
				trains.show(resp.value);
				for( var i=0; i<trains._list.length; i++){
					var ttrain=trains._list[i];
					if(checkTrainNumber(ttrain)){
						//iterate over vagon types
						for(var vt=0;vt<ttrain.types.length;vt++){
							var ttype = ttrain.types[vt];
							if(ttype.letter === "К"){
								trains._onWagonTypeClick(ttype,ttrain);
								setTimeout(function() {
									processVagons(ttrain); }, 5000);
							}
						}

					}
				}
			}
		});
	}
};
var tc = new TrainCheck();
tc.start(30000, "106");