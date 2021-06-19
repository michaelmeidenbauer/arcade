import global from "/global.js";
import { angerNoodle } from "/angerNoodle.js";
import { connectFur } from "/connectFur.js";

// angerNoodle.startGame();

//fix this later!
$('.connect-fur, .snake, .game-over-angerNoodle').hide();

const mainMenu = $('.main-menu');

$('#angerNoodleBox').click(function () {
    launchGame('angerNoodle');
});
$('#connectFurBox').click(function () {
    launchGame('connectFur');
});

function launchGame (game) {
    mainMenu.hide();
    if (game === "angerNoodle") {
        angerNoodle.startGame();
    }
    if (game === "connectFur") {
        connectFur.startGame();
    }
   
}