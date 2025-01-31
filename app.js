"use strict";

import mockFileSystem from "./modules/filesystem.js";

// instatiates the filesystem and sets the current directory and files.
const lesson1 = mockFileSystem();

const cmdInput = document.querySelector("#cmdInput");
const inputArea = document.querySelector("#inputArea");
const lastLogin = document.querySelector(".lastLogin");
const terminal = document.querySelector("#terminal");
const workingDir = document.querySelector(".workingDir");

// Sets the prompt for the terminal and includes the current working directory if not root.
function setPrompt() {
  let currentDir = lesson1.currentWorkingDirectory.split("/").pop();
  if (lesson1.currentWorkingDirectory === "/Users/myquite") {
    return `<span class="cmd">➜ <span class="workingDir">~</span> </span>`;
  } else {
    workingDir.innerHTML = `${currentDir}`;
    return `<span class="cmd">➜ <span class="workingDir">${currentDir}</span> </span>`;
  }
}

// this function the scroll bar at the bottom of the terminal
function scrollToBottom() {
  terminal.scrollTop = terminal.scrollHeight;
}

// builds and sets the last login info  when page is first loaded
function updateLastLogin() {
  let lastLogin = document.querySelector(".lastLogin");

  function getDate() {
    let currentDate = new Date();
    return currentDate.toString().slice(0, 24);
  }

  lastLogin.innerText = `Last Login: ${getDate()} on ttys000`;
}

// split an input into an array so that multiple arguments can be accepted
function inputArgV(input) {
  const argv = input.split(" ");
  return argv;
}

// this function generates the output for the ls command
function listFiles(dir, files) {
  let output = "";
  for (let i = 0; i < dir.length; i++) {
    output += `<span class="dir">${dir[i]}</span> `;
  }
  for (let i = 0; i < files.length; i++) {
    output += `<span>${files[i]}</span> `;
  }
  return output;
}

function help() {
  return `
  <span class="cmd">help</span> - displays this help message
  <br>
  <span class="cmd">clear</span> - clears the terminal
  <br>
  <span class="cmd">ls</span> - lists files and folders in the current directory
  <br>
  <span class="cmd">cat</span> - displays the contents of a file
  <br>
  <span class="cmd">`;
}

// this command handler takes the input and generates the output based on options defined below in switch statement.
function cmdHandler(text, cmd) {
  if (cmd) {
    return `${setPrompt()} <span class="prevCmd">${cmd}</span></span><p>${text}</p>`;
  } else {
    return `${setPrompt()}<p></p>`;
  }
}

// the event listener captures the input on enter and passes it through the switch statement to handle the various commands
cmdInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    let input = event.target.value.toString();
    let argv = inputArgV(input);

    switch (argv[0]) {
      case "clear":
        lastLogin.remove();
        inputArea.innerHTML = "";
        break;
      case "echo":
        inputArea.innerHTML += cmdHandler("echo", input);
        break;
      case "pwd":
        inputArea.innerHTML += cmdHandler(
          lesson1.currentWorkingDirectory,
          input
        );
        break;
      case "ls":
        inputArea.innerHTML += cmdHandler(
          listFiles(lesson1.currentDirectories, lesson1.currentFiles),
          input
        );
        break;
      case "help":
        inputArea.innerHTML += cmdHandler(help(), input);
        break;
      case "cat":
        if (argv.includes("index.html")) {
          inputArea.innerHTML += cmdHandler(
            lesson1.fileContents["index.html"],
            input
          );
        } else {
          if (argv[1]) {
            inputArea.innerHTML += cmdHandler(
              `No such file or directory: ${argv[1]}`,
              input
            );
          } else {
            inputArea.innerHTML += cmdHandler("cat: missing operand", input);
          }
        }
        break;
      case "cd":
        inputArea.innerHTML += cmdHandler(`${argv}`, input);
        break;
      default:
        inputArea.innerHTML += cmdHandler("command not found:", input);
    }

    event.target.value = "";
    scrollToBottom();
  }
});

setPrompt();
updateLastLogin();
