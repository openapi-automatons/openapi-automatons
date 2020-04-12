#!/usr/bin/env node
import generator from "../index";

generator()
    .then(() => console.log('complete'));
