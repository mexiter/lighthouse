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

const Gatherer = require('./gatherer');

class Viewport extends Gatherer {

  /**
   * @param {!{driver: !Object}} options Run options
   * @return {!Promise<?string>} The value of the viewport meta's content attribute, or null
   */
  afterPass(options) {
    const driver = options.driver;

    return driver.querySelector('head meta[name="viewport"]')
      .then(node => node && node.getAttribute('content'))
      .catch(_ => {
        return -1;
      });
  }
}

module.exports = Viewport;
