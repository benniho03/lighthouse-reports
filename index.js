import fs from 'fs';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';


const chrome = await chromeLauncher.launch({ startingUrl: "https://api-ebwd.witglobal.net/benchmark" });
const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
    formFactor: 'desktop',
    throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0
    },
    screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false
    },
    emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/ 537.36(KHTML, like Gecko) Chrome/84.0.4143.7 Safari/537.36 Chrome - Lighthouse'
};

const csr = []
const ssr = []
const ssg = []
const isr = []

for (let iteration = 0; iteration < 100; iteration++) {

    const ssrRunnerResult = await lighthouse('https://api-ebwd.witglobal.net/benchmark/ssr', options);
    const ssrReportJSON = (JSON.parse(ssrRunnerResult.report)).audits.metrics.details.items[0];
    ssr.push(ssrReportJSON)
    
    const csrRunnerResult = await lighthouse('https://api-ebwd.witglobal.net/benchmark/csr', options);
    const csrReportJSON = (JSON.parse(csrRunnerResult.report)).audits.metrics.details.items[0];
    csr.push(csrReportJSON)
    
    const ssgRunnerResult = await lighthouse('https://api-ebwd.witglobal.net/benchmark/ssg', options);
    const ssgReportJSON = (JSON.parse(ssgRunnerResult.report)).audits.metrics.details.items[0];
    ssg.push(ssgReportJSON)
    
    const isrRunnerResult = await lighthouse('https://api-ebwd.witglobal.net/benchmark/isr', options);
    const isrReportJSON = (JSON.parse(isrRunnerResult.report)).audits.metrics.details.items[0];
    isr.push(isrReportJSON)

    console.log("Finished Cicle No.", iteration)
    
}

fs.writeFileSync(`csr.json`, JSON.stringify(csr));
fs.writeFileSync(`ssg.json`, JSON.stringify(ssr));
fs.writeFileSync(`isr.json`, JSON.stringify(isr));
fs.writeFileSync(`ssr.json`, JSON.stringify(ssg));

await chrome.kill();