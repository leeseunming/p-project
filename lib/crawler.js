const puppeteer = require('puppeteer');
const { saveToDatabase } = require('./carddb');

(async () => {
    try {
        console.log('크롤링 시작...');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // 크롤링할 URL 목록
        const urls = [
            'https://www.card-gorilla.com/card/detail/2752',
            'https://www.card-gorilla.com/card/detail/2683',
            'https://www.card-gorilla.com/card/detail/2751',
        ];

        for (const url of urls) {
            console.log(`URL 이동: ${url}`);
            await page.goto(url, { waitUntil: 'networkidle2' });

            // 카드 이름 크롤링
            const cardName = await page.$eval(
                '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.data_area.multi > div.tit > strong',
                el => el.innerText.trim()
            );

            // 연회비 크롤링
            const annualFee = await page.$eval(
                '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.bnf2 > dl:nth-child(1) > dd.in_out',
                el => el.innerText.trim()
            );

            // 전월 실적 크롤링
            const requiredUsage = await page.$eval(
                '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.bnf2 > dl:nth-child(2)',
                el => el.innerText.trim()
            );

            // 카드 종류 (고정값)
            const cardType = '신용카드';

            // 혜택 정보 크롤링 (최대 5개)
            const benefits = await page.$$eval(
                '#q-app > section > div.card_detail.fr-view > section > div > article.cmd_con.benefit > div.lst.bene_area > dl > dt > i',
                elements => elements.map(el => el.innerText.trim()).slice(0, 5)
            );

            // 이미지 URL 크롤링
            const imageUrl = await page.$eval(
                '#q-app > section > div.card_detail.fr-view > section > div > article.card_top > div > div > div.plate_area > div > div > div.q-carousel__slides-container > div > div > img',
                el => el.src
            );

            const cardData = {
                card_id: urls.indexOf(url) + 1,
                card_name: cardName || '미정',
                annual_fee: annualFee || '없음',
                required_usage: requiredUsage || '없음',
                card_type: cardType,
                benefits: benefits,
                image_url: imageUrl || '없음',
            };

            console.log('크롤링된 데이터:', cardData);

            // 데이터 저장
            await saveToDatabase(cardData);
        }

        await browser.close();
        console.log('브라우저 닫힘. 크롤링 종료.');
    } catch (error) {
        console.error('크롤링 중 오류 발생:', error.message);
    }
})();
