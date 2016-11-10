'use strict';

require('sugar');

const
	yeoman = require('yeoman-generator'),
	core = require('@pzlr/build-core'),
	Base = require('../base/Base');

module.exports = yeoman.Base.extend(Object.merge(Base, {
	constructor: function () {
		yeoman.Base.call(this, ...arguments);

		this.argument('blockName', {
			type: String,
			optional: true,
			desc: 'Name of the created block',
			defaults: ''
		});

		this.argument('projectType', {
			type: String,
			optional: true,
			desc: 'Type of project',
			defaults: core.config.projectType || ''
		});

		this.argument('message', {
			type: String,
			desc: 'Message text for user',
			defaults: 'Enter the name of the created block:'
		});

		this.option('parent', {
			desc: 'Parent block',
			type: String,
			alias: 'p'
		});
	},

	initializing: {
		validateName() {
			if (!this.blockName) {
				return;
			}

			if (!core.validators.blockName(this.blockName)) {
				this.log(`Invalid block name "${this.blockName}" (should match pattern "^[gibp]-[a-z0-9-]*$")`);
				this.blockName = false;
				this.message = 'Enter the right name of the created block:';

			} else if (this.blocksList.indexOf(this.blockName) !== -1) {
				this.log(`Block ${this.blockName} c`);
				this.blockName = false;
				this.message = 'Enter the new name of the created block:';
			}
		},

		validateParent() {
			const
				parent = this.options.parent;

			if (parent && (this.blocksList.indexOf(parent) === -1)) {
				this.log(`Parent block ${parent} is not exists`);
				this.options.parent = false;
			}
		}
	},

	prompting() {
		const
			done = this.async(),
			messageText = this.message,
			empty = {
				name: '--none---',
				value: null,
				short: 'none'
			};

		this.prompt([
			{
				name: 'projectType',
				message: 'Select type of project (js/ts/static)',
				type: 'list',
				choices: ['js', 'ts', 'static'],

				when: () => !this.projectType
			},

			{
				name: 'blockName',
				message: messageText,
				validate: (val) => {
					let approved;
					approved = this.blocksList.indexOf(val) !== -1 ? `Block "${val}" is already exists` : true;
					if (!core.validators.blockName(val)) approved = `Invalid block name "${val}" (should match pattern "^[gibp]-[a-z0-9-]*$")`;
					return approved;
				},

				filter: (val) => val && val.trim(),
				when: () => !this.blockName,
			},

			{
				name: 'parent',
				message: 'Select the parent block',
				type: 'list',
				choices: this.blocksList.filter((val) => val.charAt(0) !== 'g').concat([empty]),
				default: (answers) => {
					const
						blockName = this.blockName || answers.blockName;

					switch (blockName.charAt(0)) {
						case 'p':
							return this.blocksList.indexOf('i-page');

						case 'b':
							return this.blocksList.indexOf('i-block');

						case 'g':
							return this.blocksList.length;

						default:
							return this.blocksList.indexOf('i-base');
					}
				},

				when: () => !this.parent
			},

			{
				name: 'dependencies',
				message: 'Check dependencies of the block',
				type: 'checkbox',
				choices: this.blocksList.filter((val) => val.charAt(0) !== 'i')
			}

		], (answers) => {
			Object.assign(this, answers);
			done();
		});
	},

	writing: {
		writing() {
			this.fs.copyTpl(
				this.templatePath('index.ejs'),
				this.destinationPath('index.js'),
				this
			);
			console.log('type:',this.projectType);
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

					this.fs.copyTpl(
						this.templatePath('ss-declaration.ejs'),
						this.destinationPath(`${this.blockName}.ss.ts`),
						this
					);
				}

				this.fs.copyTpl(
					this.templatePath('template.ejs'),
					this.destinationPath(
						this.blockName + (this.blockName.charAt(0) === 'p' ? '.ess' : '.ss')
					),
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
}, true));
