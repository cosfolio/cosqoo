// =====================================
// COSQOO! script.js 前半
// =====================================

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1980;

// --------------------
// DOM
// --------------------

const memberList = document.getElementById("memberList");
const addMemberButton = document.getElementById("addMemberButton");
const generateTextButton = document.getElementById("generateTextButton");
const generateImageButton = document.getElementById("generateImageButton");
const outputText = document.getElementById("outputText");

// --------------------
// メンバー追加
// --------------------

addMemberButton.addEventListener("click", () => {

    const row = document.createElement("div");

    row.className = "member-row";

    row.innerHTML = `

        <div class="member-field">
            <span>キャラ</span>
            <input
                type="text"
                class="member-character"
                placeholder="キャラ">
        </div>

        <div class="member-field">
            <span>名前</span>
            <input
                type="text"
                class="member-name"
                placeholder="名前">
        </div>

        <div class="member-field">
            <span>X ID</span>
            <input
                type="text"
                class="member-id"
                placeholder="xxxx">
        </div>

    `;

    memberList.appendChild(row);

});

// --------------------
// テキスト生成
// --------------------

generateTextButton.addEventListener(
    "click",
    generateOutputText
);

function generateOutputText() {

    const lines = [];

    // 日付

    if (document.getElementById("dateUnknown").checked) {

        lines.push("📅 日時未定");

    } else {

        const value =
            document.getElementById("eventDate").value;

        if (value) {

            lines.push("📅 " + value);

        }

    }

    // 場所

    const location =
        document.getElementById("location").value.trim();

    if (location) {

        lines.push("📍 " + location);

    }

    // 費用

    let cost =
        document.getElementById("cost").value.trim();

    if (
        document.getElementById("costCosplayer").checked
    ) {

        cost += "（レイヤーのみ負担）";

    }

    if (
        document.getElementById("costSelf").checked
    ) {

        cost += "（全員自己負担）";

    }

    if (cost) {

        lines.push("💰 " + cost);

    }

    // 募集範囲

    if (document.getElementById("range").value) {

        lines.push(
            "🌸 募集範囲：" +
            document.getElementById("range").value
        );

    }

    // 条件

    if (document.getElementById("condition").value) {

        lines.push(
            "✨ 条件：" +
            document.getElementById("condition").value
        );

    }

    // 応募方法

    const methods = [];

    if (document.getElementById("reply").checked) {

        methods.push("リプライ");

    }

    if (document.getElementById("like").checked) {

        methods.push("いいね");

    }

    if (document.getElementById("dm").checked) {

        methods.push("DM");

    }

    if (methods.length > 0) {

        lines.push(
            "📩 応募方法：" +
            methods.join("・")
        );

    }

    // 作品

    lines.push("");

    lines.push("🎭 作品");

    lines.push(
        document.getElementById("title").value
    );

    // 募集メンバー

    lines.push("");

    lines.push("🙋 募集メンバー");

    lines.push(
        document.getElementById("wanted").value
    );

    // 確定メンバー

    lines.push("");

    lines.push("✅ 確定メンバー");

    document
        .querySelectorAll(".member-row")
        .forEach(row => {

            const c =
                row.querySelector(".member-character").value;

            const n =
                row.querySelector(".member-name").value;

            const x =
                row.querySelector(".member-id").value;

            if (c || n || x) {

                lines.push(
                    `・${c} / ${n} / @${x}`
                );

            }

        });

    lines.push("");
    lines.push("#コスキュー");
    lines.push("#合わせ募集");

    outputText.value =
        lines.join("\n");

}

// --------------------
// Canvas文字折返し
// --------------------

function drawWrappedText(
    ctx,
    text,
    x,
    y,
    maxWidth,
    lineHeight
) {

    const split =
        String(text).split("\n");

    split.forEach(oneLine => {

        let line = "";

        for (const ch of oneLine) {

            const test =
                line + ch;

            if (
                ctx.measureText(test).width >
                maxWidth
            ) {

                ctx.fillText(
                    line,
                    x,
                    y
                );

                y += lineHeight;

                line = ch;

            } else {

                line = test;

            }

        }

        ctx.fillText(
            line,
            x,
            y
        );

        y += lineHeight;

    });

    return y;

}

// --------------------
// ボタン
// --------------------

generateImageButton.addEventListener(
    "click",
    generateImage
);

// generateImage() は後半で定義


// =====================================
// generateImage()
// =====================================

async function generateImage() {

    // Safari対策：
    // ユーザー操作直後に新しいタブを開く
    const imageWindow = window.open("", "_blank");

    if (!imageWindow) {
        alert("新しいタブを開けませんでした。");
        return;
    }

    // フォント読み込み待ち
    if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
    }

    // Canvas作成
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const ctx = canvas.getContext("2d");

    // 背景
    ctx.fillStyle =
        document.getElementById("bgColor").value;

    ctx.fillRect(
        0,
        0,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
    );

    // 文字色
    ctx.fillStyle =
        document.getElementById("textColor").value;

    ctx.textAlign = "left";

    // ロゴ読込
    const logo = new Image();

    logo.src = "logo.png";

    await new Promise(resolve => {

        logo.onload = resolve;
        logo.onerror = resolve;

    });

    let y = 50;

    if (
        logo.complete &&
        logo.naturalWidth > 0
    ) {

        const width = 420;

        const height =
            logo.naturalHeight *
            width /
            logo.naturalWidth;

        ctx.drawImage(

            logo,

            (CANVAS_WIDTH - width) / 2,

            y,

            width,

            height

        );

        y += height + 60;

    }

    // 本文フォント

    ctx.font =
        '46px "Zen Maru Gothic", sans-serif';

    // -----------------------
    // 開催情報
    // -----------------------

    const dateText =
        document.getElementById("dateUnknown").checked
        ? "日時未定"
        : document.getElementById("eventDate").value;

    y = drawWrappedText(

        ctx,

        "📅 " + dateText,

        70,

        y,

        940,

        58

    );

    y = drawWrappedText(

        ctx,

        "📍 " +
        document.getElementById("location").value,

        70,

        y,

        940,

        58

    );

    let cost =
        document.getElementById("cost").value;

    if (
        document.getElementById("costCosplayer").checked
    ) {

        cost += "（レイヤーのみ負担）";

    }

    if (
        document.getElementById("costSelf").checked
    ) {

        cost += "（全員自己負担）";

    }

    y = drawWrappedText(

        ctx,

        "💰 " + cost,

        70,

        y,

        940,

        58

    );

    y += 15;

    // -----------------------
    // 募集条件
    // -----------------------

    ctx.font =
        'bold 50px "Zen Maru Gothic", sans-serif';

    ctx.fillText(
        "🌸 募集条件",
        70,
        y
    );

    y += 70;

    ctx.font =
        '46px "Zen Maru Gothic", sans-serif';

    y = drawWrappedText(

        ctx,

        "募集範囲：" +
        document.getElementById("range").value,

        70,

        y,

        940,

        58

    );

    y = drawWrappedText(

        ctx,

        "条件：" +
        document.getElementById("condition").value,

        70,

        y,

        940,

        58

    );

    const methods = [];

    if (document.getElementById("reply").checked) {
        methods.push("リプライ");
    }

    if (document.getElementById("like").checked) {
        methods.push("いいね");
    }

    if (document.getElementById("dm").checked) {
        methods.push("DM");
    }

    y = drawWrappedText(

        ctx,

        "応募方法：" +
        methods.join("・"),

        70,

        y,

        940,

        58

    );

    y += 20;

    // -----------------------
    // 作品
    // -----------------------

    ctx.font =
        'bold 50px "Zen Maru Gothic", sans-serif';

    ctx.fillText(
        "🎭 作品",
        70,
        y
    );

    y += 65;

    ctx.font =
        '46px "Zen Maru Gothic", sans-serif';

    y = drawWrappedText(

        ctx,

        document.getElementById("title").value,

        70,

        y,

        940,

        58

    );

    y += 20;

    // -----------------------
    // 募集メンバー
    // -----------------------

    ctx.font =
        'bold 50px "Zen Maru Gothic", sans-serif';

    ctx.fillText(
        "🙋 募集メンバー",
        70,
        y
    );

    y += 65;

    ctx.font =
        '46px "Zen Maru Gothic", sans-serif';

    y = drawWrappedText(

        ctx,

        document.getElementById("wanted").value,

        70,

        y,

        940,

        58

    );

    y += 20;

    // -----------------------
    // 確定メンバー
    // -----------------------

    ctx.font =
        'bold 50px "Zen Maru Gothic", sans-serif';

    ctx.fillText(
        "✅ 確定メンバー",
        70,
        y
    );

    y += 65;

    ctx.font =
        '42px "Zen Maru Gothic", sans-serif';

    document
        .querySelectorAll(".member-row")
        .forEach(row => {

            const c =
                row.querySelector(".member-character").value;

            const n =
                row.querySelector(".member-name").value;

            const x =
                row.querySelector(".member-id").value;

            if (c || n || x) {

                ctx.fillText(

                    `${c}　${n}　@${x}`,

                    70,

                    y

                );

                y += 52;

            }

        });

    // JPEG生成

    const dataUrl =
        canvas.toDataURL(
            "image/jpeg",
            0.95
        );

    // 新しいタブに画像だけ表示

    imageWindow.document.open();

    imageWindow.document.write(`
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>生成画像</title>
<style>
html,body{
    margin:0;
    padding:0;
    background:#000;
}
img{
    display:block;
    width:100%;
    height:auto;
}
</style>
</head>
<body>
<img src="${dataUrl}" alt="生成画像">
</body>
</html>
`);

    imageWindow.document.close();

}
