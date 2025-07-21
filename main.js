"use strict";
// JS Assessment: Find Your Hat //

import promptSync from "prompt-sync";
import clear from "clear-screen";

const prompt = promptSync({ sigint: true });

// Symbols
const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
	constructor(field = [[]]) {
		this.field = field;
		this.positionRow = 0;
		this.positionCol = 0;
		this.gameOver = false;
		this.field[this.positionRow][this.positionCol] = pathCharacter;
	}

	print() {
		clear();
		this.field.forEach(row => {
			console.log(row.join(""));
		});
	}

	move(direction) {
		switch (direction) {
			case "U": this.positionRow--; break;
			case "D": this.positionRow++; break;
			case "L": this.positionCol--; break;
			case "R": this.positionCol++; break;
			default:
				console.log("⛔ Invalid input. Use U, D, L, or R.");
				return;
		}

		// Check out of bounds
		if (
			this.positionRow < 0 ||
			this.positionCol < 0 ||
			this.positionRow >= this.field.length ||
			this.positionCol >= this.field[0].length
		) {
			console.log("❌ You went out of bounds! Game Over.");
			this.gameOver = true;
			return;
		}

		// Check the current tile
		const currentTile = this.field[this.positionRow][this.positionCol];
		if (currentTile === hole) {
			console.log("💀 You fell into a hole! Game Over.");
			this.gameOver = true;
		} else if (currentTile === hat) {
			console.log("🎉 You found your hat! You win!");
			this.gameOver = true;
		} else {
			// Mark path
			this.field[this.positionRow][this.positionCol] = pathCharacter;
		}
	}

	static generateField(height, width, holePercentage = 0.2) {
		const field = [];

		for (let y = 0; y < height; y++) {
			const row = [];
			for (let x = 0; x < width; x++) {
				const rand = Math.random();
				row.push(rand < holePercentage ? hole : fieldCharacter);
			}
			field.push(row);
		}

		// Ensure start is safe
		field[0][0] = pathCharacter;

		// Place hat randomly (not at 0,0)
		let hatRow, hatCol;
		do {
			hatRow = Math.floor(Math.random() * height);
			hatCol = Math.floor(Math.random() * width);
		} while (hatRow === 0 && hatCol === 0);
		field[hatRow][hatCol] = hat;

		return new Field(field);
	}
}

// Game Start
const myField = Field.generateField(5, 7, 0.25); // Adjust size and hole density here

while (!myField.gameOver) {
	myField.print();
	const direction = prompt("Which way? (U = up, D = down, L = left, R = right): ").toUpperCase();
	myField.move(direction);
}
