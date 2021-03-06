/**
 * @license
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const Gatherer = require('../gatherer');

const MAX_WAIT_TIMEOUT = 500;

class WebSQL extends Gatherer {

  listenForDatabaseEvents(driver) {
    let timeout;

    return new Promise((resolve, reject) => {
      driver.once('Database.addDatabase', db => {
        clearTimeout(timeout);
        driver.sendCommand('Database.disable').then(_ => resolve(db), reject);
      });

      driver.sendCommand('Database.enable').catch(reject);

      // Wait for a websql db to be opened. Reject the Promise no dbs were created.
      // TODO(ericbidelman): this assumes dbs are opened on page load.
      // load. Figure out a better strategy (code greping, user interaction) later.
      timeout = setTimeout(function() {
        resolve(null);
      }, MAX_WAIT_TIMEOUT);
    });
  }

  afterPass(options) {
    return this.listenForDatabaseEvents(options.driver)
      .then(database => {
        const artifact = {
          database
        };
        if (!database) {
          artifact.debugString = 'No WebSQL databases were opened';
        }
        return artifact;
      }).catch(_ => {
        return {
          database: -1,
          debugString: 'Unable to gather WebSQL database state'
        };
      });
  }
}

module.exports = WebSQL;
