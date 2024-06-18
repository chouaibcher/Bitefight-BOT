// ==UserScript==
// @name         BiteFight
// @namespace    https://*.bitefight.gameforge.com/
// @version      0.1
// @license      GPL3
// @description  Bot for BiteFight game.
// @author       Chouaibcher
// @match        https://*.bitefight.gameforge.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    'use strict';

    // Constants
    const DEFAULT_REQUEST_DELAY_IN_MILLISECONDS = 1000 + (Math.random() * 100);
    const SKILLS = ["STR", "DEF", "DEX", "RES", "CHA"];
    const RAISESKILLS = false;
    const DIFFICULTYOGROTTE = 2; // 0 = Easy | 1 = Medium | 2 = Hard
    const SERVERURL = window.location.origin;

    // Script storage keys
    const KEY_CHARACTER = 'character';

    // Define character object
    let CHARACTER = JSON.parse(localStorage.getItem(KEY_CHARACTER)) || {
        energy: 0,
        fragments: 0,
        gold: 0,
        health: 0,
        hellStones: 0,
        skills: {
            STR: 0,
            DEF: 0,
            DEX: 0,
            RES: 0,
            CHA: 0
        }
    };


      var chosenTimeList = [4054,3400, 3343, 1030, 2243,2433,1245,3032];
      var chosenTimeIndex = Math.floor(Math.random() * chosenTimeList.length);
               var chosenTime = chosenTimeList[chosenTimeIndex];

    // Get Stats
    var allStatsElement = document.getElementsByClassName("gold")[0];
    var statsValues = allStatsElement.textContent.split("\n");
    statsValues = statsValues.map(value => value.trim());
    statsValues.shift();

    // Separate and assign values
    var energy = formatNumber(statsValues[3].substr(0, statsValues[3].indexOf("/") - 1));
    if (energy) CHARACTER.energy = parseInt(energy);
    var fragments = formatNumber(statsValues[2]);
    if (fragments) CHARACTER.fragments = parseInt(fragments);
    var gold = formatNumber(statsValues[0]);
    if (gold) CHARACTER.gold = parseInt(gold);
    var health = formatNumber(statsValues[4].substr(0, statsValues[4].indexOf("/") - 1));
    if (health) CHARACTER.health = parseInt(health);
    var hellStones = formatNumber(statsValues[1]);
    if (hellStones) CHARACTER.hellStones = parseInt(hellStones);

    updateCharacter();

    setTimeout(() => {
        switch (location.pathname) {
            case "/profile":
            case "/profile/index":
                var skillsTable = document.querySelector("div#skills_tab > div > div > div > table");
                var chosenSkillList = [];
                for (var i=0;i<5;i++){
                 if (skillsTable.rows[i].cells[2].querySelector("div > a")){
                 chosenSkillList.push(i)
                }
                }
                console.log(chosenSkillList)
                var chosenSkillIndex = Math.floor(Math.random() * chosenSkillList.length);
                var chosenSkill = chosenSkillList[chosenSkillIndex];

                getSkills(skillsTable, chosenSkill);

                sleep(chosenTime).then(() => {

                skillsTable.rows[chosenSkill].cells[2].querySelector("div > a").click()


                });

                if (chosenSkillList.length === 0 && CHARACTER.energy > 0 && CHARACTER.health > 1000) {
                //goTorobbery()
                    goToGrotte()
                }
                break;
            case "/robbery/index":
                console.log("Soon");
                break;
            case "/robbery/humanhunt/1":
            case "/robbery/humanhunt/2":
            case "/robbery/humanhunt/3":
            case "/robbery/humanhunt/4":
            case "/robbery/humanhunt/5":
                sleep(chosenTime).then(() => {
                if (CHARACTER.energy && CHARACTER.health > 0) document.forms[0].submit();
                 else goToProfile();


                });
               // else goToAbilities();
                break;
            case "/city/graveyard":
                console.log("Soon");
                break;
            case "/city/grotte":
                
                CHARACTER.energy && CHARACTER.health > 0 ? huntDemons() : goToWork();
                
                break;
            case "/user/working":
                console.log("Soon");
                break;
            default:
                goToProfile();
                break;
        }
    }, DEFAULT_REQUEST_DELAY_IN_MILLISECONDS);

    // Format texts to return as numbers (no thousand separators)
    function formatNumber(value) {
        while (value.indexOf(".") > 0) value = value.replace(".", "");
        return value;
    }

    function goToProfile() {
        location = SERVERURL + "/profile";
    }

    function goHunting() {
        location = SERVERURL + "/robbery/index";
    }

    function goToWork(){
        location = SERVERURL + "/city/graveyard";
    }

    function goToAbilities() {
        location = SERVERURL + "/profile/index#tabs-2";
    }
    function goTorobbery() {
        location = SERVERURL + "/robbery/humanhunt/1";
    }
    function goToGrotte() {
        location = SERVERURL + "/city/grotte";
    }

    function huntDemons() {
        document.querySelectorAll("table.noBackground form.clearfix div input")[DIFFICULTYOGROTTE].click();
    }

    // Gets the basic value for a skill in given table cell.
    function getSkillValue(cell) {
        return parseInt(cell.querySelector("table > tbody > tr:nth-child(5n) > td:nth-child(2n)").textContent);
    }

    function getSkills(skillsTable, chosenSkill) {
        var auxValue = Math.min();
        for (let i = 0; i < SKILLS.length; i++) {
            let value = getSkillValue(skillsTable.rows[i].cells[1]);
            CHARACTER.skills[SKILLS[i]] = parseInt(value);
            if (value < auxValue) {
                auxValue = value;
                chosenSkill = i;
            }
        }
    }




    // Update character in local storage
    function updateCharacter() {
        localStorage.setItem(KEY_CHARACTER, JSON.stringify(CHARACTER));
    }

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
})();
