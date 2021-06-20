import global from "/global.js";
import { angerNoodle } from "/angerNoodle.js";
import { connectFur } from "/connectFur.js";

const mainMenu = $('.main-menu');

$('#angerNoodleBox').click(angerNoodle.startGame);
$('#connectFurBox').click(connectFur.startGame);