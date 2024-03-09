const { execSync } = require('child_process')
const path = require('path')
const assert = require('assert')
const fs = require('fs')
const binFileUtils = require('@iden3/binfileutils')
const r1csfile = require('r1csfile')

function circom2(args) {
    const cmd = path.join('../', require('../package.json')['bin']['circom2mpc'])
    console.log(cmd);
    return execSync(cmd + ' ' + args, {
        cwd: __dirname,
    }).toString('utf-8')
}

const tests = []

function test(name, fn) {
    tests.push({ name, fn })
}

async function run() {
    for (let { name, fn } of tests) {
        const filters = process.argv.slice(2).join(' ').trim()
        if (!name.includes(filters)) {
            console.log('⏭️ ', name)
            continue
        }
        try {
            if (!fs.existsSync(__dirname + '/out')) fs.mkdirSync(__dirname + '/out')
            await fn()
            console.log('✅', name)
        } catch (e) {
            console.log('❌', name)
            console.log(e.stack)
        } finally {
            if (fs.existsSync(__dirname + '/out'))
                fs.rmSync(__dirname + '/out', { recursive: true })
        }
    }
}

test('circom2 command executes', () => {
    const stdout = circom2('--help')
    assert(stdout.includes('circom compiler'), 'missing stdout')
})

test('basic compile', () => {
    const stdout = circom2('--input basic.circom')
    assert(stdout.includes('Everything went okay'), 'compilation failed')
})

test('mimc compile', () => {
    const stdout = circom2('--input mimc.circom')
    assert(stdout.includes('Everything went okay'), 'compilation failed')
})

test('tuple compile', () => {
    const stdout = circom2('--input tuples.circom --output')
    assert(stdout.includes('Everything went okay'), 'compilation failed')
})


run()
