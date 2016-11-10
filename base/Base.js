'use strict';

require('sugar').extend();

const
	fs = require('fs'),
	core = require('@pzlr/build-core');

module.exports = {
	initializing: {
		disclaimerLoading() {
			this.disclaimer = null;
			const disclaimerPath = core.config.disclaimer;

			if (disclaimerPath) {
				try {
					this.disclaimer = fs.readFileSync(this.destinationPath(disclaimerPath));

				} catch (err) {
					this.log(`Failed to load disclaimer file ${this.destinationPath(disclaimerPath)}`);
				}
			}
		},

		pathSetting() {
			this.destinationRoot(core.resolve.block());
		},

		blocksListLoading() {
			this.blocksList = fs.readdirSync(this.destinationPath()).filter(core.validators.blockName).sort();
		}
	},

	writing: {
		pathsSetting() {
			this.destinationRoot(core.resolve.block(this.blockName));
		}
	}
};
