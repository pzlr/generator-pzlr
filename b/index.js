'use strict';

const
	yeoman = require('yeoman-generator'),
	core = require('@pzlr/build-core'),
	{config} = core,
	Base = require('../base/Base');

// внести эту функцию внутрь объекта не получается,
// пришлось её чистой делать
function validateBlockName(name, blocksList) {
	if (!core.validators.blockName(name)) {
		return `Invalid block name (should match pattern "^[gibp]-[a-z0-9-]+$")`;
	}

	if (blocksList.includes(name)) {
		return `Block "${name}" already exists`;
	}

	return true;
}

module.exports = yeoman.Base.extend(Object.merge(Base, {
	constructor: function () { // eslint-disable-line object-shorthand
		yeoman.Base.call(this, ...arguments);

		this.argument('blockName', {
			type: String,
			optional: true,
			desc: 'Name of the created block',
			defaults: ''
		});

		this.projectType = config.projectType;
	},

	initializing: {
		blocksNameValidation() {
			if (!this.blockName) {
				return;
			}

			const validity = validateBlockName(this.blockName, this.blocksList);

			if (validity === true) {
				return;
			}

			this.log(validity);
			this.blockName = false;
		}
	},

	prompting() {
		const
			done = this.async(),
			empty = {
				name: '--none---',
				value: null,
				short: 'none'
			},

			parentChoices = this.blocksList.filter((val) => !/^g/.test(val)).concat([empty]);

		this.prompt([
			{
				name: 'blockName',
				message: 'Enter a name for the new block:',
				validate: (val) => validateBlockName(val, this.blocksList),
				filter: (val) => val && val.trim(),
				when: () => !this.blockName,
			},

			{
				name: 'parent',
				message: 'Select the parent block',
				type: 'list',
				choices: parentChoices,
				default: (answers) => {
					const
						blockName = this.blockName || answers.blockName;

					switch (blockName.charAt(0)) {
						case 'p':
							return parentChoices.indexOf('i-page');

						case 'b':
							return parentChoices.indexOf('i-block');

						case 'g':
							return parentChoices.indexOf(empty);

						default:
							return parentChoices.indexOf('i-base');
					}
				}
			},

			{
				name: 'dependencies',
				message: 'Check dependencies of the block',
				type: 'checkbox',
				choices: this.blocksList.filter((val) => !/^i/.test(val))
			}

		], (answers) => {
			Object.merge(this, answers);
			done();
		});
	},

	writing: {
		writing() {
			this.fs.write(
				'index.js',
				new core.declaration({
					name: this.blockName,
					parent: this.parent,
					dependencies: this.dependencies
				}).toString()
			);

			if (this.blockName.charAt(0) !== 'i') {
				this.fs.copyTpl(
					this.templatePath('stylus.ejs'),
					this.destinationPath(`${this.blockName}.styl`),
					this
				);
			}

			if (this.blockName.charAt(0) !== 'g') {
				if (this.projectType === 'js') {
					this.fs.copyTpl(
						this.templatePath('class-js.ejs'),
						this.destinationPath(`${this.blockName}.js`),
						this
					);

				} else if (this.projectType === 'ts') {
					this.fs.copyTpl(
						this.templatePath('class-ts.ejs'),
						this.destinationPath(`${this.blockName}.ts`),
						this
					);

					if (this.blockName.charAt(0) === 'p' && this.parent) {
						this.fs.copyTpl(
							this.templatePath('p-template.ejs'),
							this.destinationPath(`${this.blockName}.ess`),
							this
						);
					}
				}

				this.fs.copyTpl(
					this.templatePath('template.ejs'),
					this.destinationPath(`${this.blockName}.ss`),
					this
				);

				this.fs.copyTpl(
					this.templatePath('stylus.interface.ejs'),
					this.destinationPath(`${this.blockName}.interface.styl`),
					this
				);
			}
		}
	}
}, {deep: true, descriptor: true}));
