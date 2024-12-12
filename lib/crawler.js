const puppeteer = require('puppeteer');
const { saveToDatabase } = require('./carddb');

const detailUrls = [
    'https://img.hyundaicard.com/cpc/cr/CPCCR0201_01.hc?cardWcd=ME4',
    'https://jiwon3.lottecard.co.kr/app/LPCDADB_V100.lc?vtCdKndC=P15590-A15590',
    'https://www.samsungcard.com/home/card/cardinfo/PGHPPCCCardCardinfoDetails001?code=AAP1483',
    'https://www.samsungcard.com/home/card/cardinfo/PGHPPCCCardCardinfoDetails001?code=AAP1731',
    'https://m.kbcard.com/CRD/DVIEW/MCAMCXHIACRC0002?mainCC=b&allianceCode=09123',
    'https://www.ibk.co.kr/cardbiz/detailBizNew.ibk?pageId=CA01020000&PDLN_CD=12&PDGR_CD=11&PDTM_CD=338&PDCD=0001&ad_cd=cardgopc&mz_cd=ICARDGO',
    'https://www.shinhancard.com/pconts/html/card/apply/credit/1226113_2207.html',
    'https://www.shinhancard.com/pconts/html/card/apply/credit/1187901_2207.html',
    'https://www.hanacard.co.kr/OPI41000000D.web?CD_PD_SEQ=17504',
    'https://www.ehyundai.com/newPortal/card/CA/CA000001_V.do?gad_source=1&gclid=Cj0KCQiAsOq6BhDuARIsAGQ4-zi5-E4ydGJ0IIEL0s3XTPwEfWcukHHvYGYAvpaNX5XU4HhM6Bf5PhMaApM_EALw_wcB',
];

let urlIndex = 0;  // URL 인덱스 추적

// 데이터를 추출하는 함수
async function extractCardData(page, url) {
    try {
        console.log(`URL 이동: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2' });

        // 데이터 추출
        let cardName;
        try {
            // 첫 번째 선택자로 시도
            cardName = await page.$eval(
                '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.data_area.multi > div.tit > strong',
                el => el.innerText.trim()
            );
        } catch (error) {
            try {
                // 첫 번째 실패 시 두 번째 선택자로 시도
                cardName = await page.$eval(
                    '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.data_area > div.tit > strong',
                    el => el.innerText.trim()
                );
            } catch (error) {
                cardName = '미정'; // 모든 선택자가 실패한 경우 기본값
            }
        }
        const annualFee = await page.$eval(
            '.card_detail .bnf2 dl dd.in_out',
            el => el.innerText.trim()
        );
        const monthly_spending_requirement = await page.$eval(
            '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.bnf2 > dl:nth-child(2)',
            el => el.innerText.trim()
        );
        const cardType = '신용카드'; // 고정 값

        // 혜택 정보 추출
        const benefit = await page.$$eval(
            '#q-app > section > div.card_detail.fr-view > section > div > article.cmd_con.benefit > div.lst.bene_area > dl > dt > i',
            elements => elements.map(el => el.innerText.trim()).slice(0, 6)
        );

        // 이미지 URL 크롤링
        let imageUrl;
        try {
            imageUrl = await page.$eval(
                '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.plate_area > div > div > div.q-carousel__slides-container > div > div > img',
                el => el.src
            );
        } catch (error) {
            try {
                imageUrl = await page.$eval(
                    '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.plate_area > div > img',
                    el => el.src
                );
            } catch (error) {
                imageUrl = '없음'; // 모든 선택자가 실패한 경우 기본값
            }
        };

        const detailUrl = detailUrls[urlIndex];
        urlIndex = (urlIndex + 1) % detailUrls.length;

        return {
            card_name: cardName || '미정',
            annual_fee: annualFee || '없음',
            monthly_spending_requirement: monthly_spending_requirement || '없음',
            card_type: cardType,
            benefit: benefit || [],
            image_url: imageUrl || '없음',
            detail_url: detailUrl
        };
    } catch (error) {
        console.error(`데이터 추출 실패 (URL: ${url}):`, error.message);
        return null;
    }
}

// 데이터 저장 로직
async function saveCardData(cardData) {
    try {
        // 혜택 데이터를 쉼표로 구분된 문자열로 변환
        cardData.benefit = cardData.benefit.join('; ');

        // 데이터 저장
        await saveToDatabase(cardData);
        console.log(`데이터 저장 성공: ${cardData.card_name}`);
    } catch (error) {
        console.error('데이터 저장 중 오류 발생:', error.message);
    }
}

// 크롤링 메인 함수
(async () => {
    try {
        console.log('크롤링 시작...');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        urlIndex = 0;

        // 크롤링할 URL 목록
        const urls = [
            'https://www.card-gorilla.com/card/detail/2669', // 현대카드 M
            'https://www.card-gorilla.com/card/detail/2717', // 디지 로카 Auto
            'https://www.card-gorilla.com/card/detail/51', // 삼성카드 taptap O
            'https://www.card-gorilla.com/card/detail/2235', // 삼성 id On
            'https://www.card-gorilla.com/card/detail/2441', // MY WE:SH
            'https://www.card-gorilla.com/card/detail/2482', // I-ALL
            'https://www.card-gorilla.com/card/detail/2666', // 신한 Point
            'https://www.card-gorilla.com/card/detail/466', // 신한 Air-One
            'https://www.card-gorilla.com/card/detail/2657', // JADE Classic
            'https://www.card-gorilla.com/card/detail/2344', // 현대백화점 카드
        ];

        for (const url of urls) {
            const cardData = await extractCardData(page, url);

            if (cardData) {
                console.log('크롤링된 데이터:', cardData);
                await saveCardData(cardData);
            } else {
                console.log('데이터 추출 실패, 건너뜀.');
            }
        }

        await browser.close();
        console.log('브라우저 닫힘. 크롤링 종료.');
    } catch (error) {
        console.error('크롤링 전체 오류 발생:', error.message);
    }
})();