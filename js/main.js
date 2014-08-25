'use strict'
function SaboteurApp(){
    var version="v1.0";
    function setStatus(msg){
        $("#app>footer").text(msg);
    }
    function playerNameEdit($nameSpan){
        $nameSpan.hide()
        .siblings("input.player-name-edit")
        .val($nameSpan.text())
        .show()
        .focus();
    }

    function playerNameEditFinished(e, $nameField){
        if ($nameField.val() && e.which === 13) {

            $nameField.siblings(".player-name")
            .text($nameField.val())
            .show();
            $nameField.hide();
            $("#new-player-name").focus();
        };
    }

    function addPlayerElement(playerName){
        var $playerSection = $("#player-template li").clone();
        $(".player-name", $playerSection).text(playerName);
        $(".del", $playerSection).click(function(){
            $playerSection.remove();
            $("#new-player-name").focus();
        });

        $(".player-name", $playerSection).dblclick(function(){
            playerNameEdit($(this));
        });
        $("input.player-name-edit", $playerSection).keypress(function(e){
            playerNameEditFinished(e,$(this));
        });
        $("#player-list").append($playerSection);
        $playerSection.click(function(){
            $playerSection.siblings().removeClass("selected");
            $playerSection.addClass("selected");
        });
    }

    function addPlayer(){
        var $nameField = $("#new-player-name");
        var name = $nameField.val();
        if(name){
            addPlayerElement(name);
            $nameField.val("").focus();

        }
    }

    this.start=function(){
        $("#app>header").append(" "+version);
        setStatus("Ready");
        $("#new-player-name").keypress(function(e){
            if(e.which === 13){
                addPlayer();
                return false;
            }
        }).focus();
        $("#roll").click(function(){
            console.log('cli');
        });
    }
}
//end of main obj

$(function(){
    window.app = new SaboteurApp();
    window.app.start();
});




function pickCards(number){
    var result;
    if (number<16) result = 1;
    else if (number >=16 && number < 24 ) result = 2;
    else result = 3;
    return result;
}
function onRoll() {
    var n_players = parseInt(document.querySelector("#n_players_range").value, 10), result = new Array();
    for (var i=0;i<n_players;i++){
        var rand_num = Math.floor(Math.random() * 28);
        result[i] = pickCards(rand_num);
        console.log(rand_num);
    }
    console.log(result);
}
var gold_image = document.querySelector("#img_gold");
gold_image.addEventListener("click", onRoll);
