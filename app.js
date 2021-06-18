import global from "/global.js";
import { angerNoodle } from "/angerNoodle.js";
import { connectFur } from "/connectFur.js";

// angerNoodle.startGame();

//fix this later!
$('.connect-fur, .snake, .connect-fur, .anger-noodle-message, .anger-noodle-controls, .game-over-angerNoodle').hide();

const mainMenu = $('.main-menu');

$('.anger-noodle').click(function () {
    launchGame('angerNoodle');
});
$('.connect-fur-button').click(function () {
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