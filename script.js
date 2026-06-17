// ==========================
// 初期設定
// ==========================

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1980;

// ==========================
// DOM取得
// ==========================

const memberList =
    document.getElementById("memberList");

const addMemberButton =
    document.getElementById("addMemberButton");

const generateTextButton =
    document.getElementById("generateTextButton");

const generateImageButton =
    document.getElementById("generateImageButton");

const outputText =
    document.getElementById("outputText");

// ==========================
// 確定メンバー追加
// ==========================

addMemberButton.addEventListener(
    "click",
    () => {

        const row =
            document.createElement("div");

        row.className = "member-row";

        row.innerHTML = `

            <input
                type="text"
                class="member-character"
                placeholder="キャラクター名"
            >

            <input
                type="text"
                class="member-name"
                placeholder="アカウント名"
            >

            <input
                type="text"
                class="member-id"
                placeholder="X ID"
            >

        `;

        memberList.appendChild(row);

    }
);

// ==========================
// テキスト生成
// ==========================

generateTextButton.addEventListener(
    "click",
    generateOutputText
);

function generateOutputText(){

    let text = "";

    // 日付

    if(
        document.getElementById("dateUnknown").checked
    ){

        text += "📅 日時未定\n";

    }else{

        text +=
            "📅 " +
            document.getElementById("eventDate").value +
            "\n";

    }

    // 場所

    text +=
        "📍 " +
        document.getElementById("location").value +
        "\n";

    // 参加費

    let cost =
        document.getElementById("cost").value;

    if(
        document.getElementById("costCosplayer").checked
    ){

        cost +=
            "（レイヤーのみ負担）";

    }

    if(
        document.getElementById("costSelf").checked
    ){

        cost +=
            "（全員自己負担）";

    }

    text +=
        "💰 " +
        cost +
        "\n";

    // 募集範囲

    text +=
        "🌸 募集範囲：" +
        document.getElementById("range").value +
        "\n";

    // 条件

    text +=
        "✨ 条件：" +
        document.getElementById("condition").value +
        "\n";

    // 応募方法

    const methods = [];

    if(document.getElementById("reply").checked){

        methods.push("リプライ");

    }

    if(document.getElementById("like").checked){

        methods.push("いいね");

    }

    if(document.getElementById("dm").checked){

        methods.push("DM");

    }

    text +=
        "📩 応募方法：" +
        methods.join("・") +
        "\n";

    // 作品

    text +=
        "\n🎭 作品\n";

    text +=
        document.getElementById("title").value +
        "\n";

    // 募集メンバー

    text +=
        "\n🙋 募集メンバー\n";

    text +=
        document.getElementById("wanted").value +
        "\n";

    // 確定メンバー

    text +=
        "\n✅ 確定メンバー\n";

    const rows =
        document.querySelectorAll(".member-row");

    rows.forEach(row=>{

        const c =
            row.querySelector(".member-character").value;

        const n =
            row.querySelector(".member-name").value;

        const x =
            row.querySelector(".member-id").value;

        if(c || n || x){

            text +=
                `・${c} / ${n} / @${x}\n`;

        }

    });

    outputText.value = text;

}

// ==========================
// テキスト折り返し
// ==========================

function drawWrappedText(
    ctx,
    text,
    x,
    y,
    maxWidth,
    lineHeight
){

    const lines =
        text.split("\n");

    for(const originalLine of lines){

        let line = "";

        for(const ch of originalLine){

            const test =
                line + ch;

            if(
                ctx.measureText(test).width >
                maxWidth
            ){

                ctx.fillText(
                    line,
                    x,
                    y
                );

                y += lineHeight;

                line = ch;

            }else{

                line = test;

            }

        }

        ctx.fillText(
            line,
            x,
            y
        );

        y += lineHeight;

    }

    return y;

}

// ==========================
// 画像生成ボタン
// （実処理は後半で実装）
// ==========================

generateImageButton.addEventListener(
    "click",
    generateImage
);

// ==========================
// 画像生成
// ==========================

async function generateImage() {

    // Webフォントの読み込み完了を待つ
    if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
    }

    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const ctx = canvas.getContext("2d");

    // 背景色
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

    // --------------------------
    // ロゴ描画
    // --------------------------

    const logo = new Image();

    logo.src = "logo.png";

    await new Promise(resolve => {

        logo.onload = resolve;

        logo.onerror = resolve;

    });

    let y = 60;

    if (logo.complete && logo.naturalWidth > 0) {

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

        y += height + 50;

    }

    // フォント設定
    ctx.font =
        '48px "Zen Maru Gothic", sans-serif';

    // --------------------------
    // 開催情報
    // --------------------------

    const dateText =
        document.getElementById("dateUnknown").checked
            ? "日時未定"
            : document.getElementById("eventDate").value;

    ctx.fillText(
        "📅 " + dateText,
        70,
        y
    );

    y += 70;

    ctx.fillText(
        "📍 " +
        document.getElementById("location").value,
        70,
        y
    );

    y += 70;

    let cost =
        document.getElementById("cost").value;

    if (
        document.getElementById("costCosplayer").checked
    ) {

        cost +=
            "（レイヤーのみ負担）";

    }

    if (
        document.getElementById("costSelf").checked
    ) {

        cost +=
            "（全員自己負担）";

    }

    ctx.fillText(
        "💰 " + cost,
        70,
        y
    );

    y += 90;

    // --------------------------
    // 募集条件
    // --------------------------

    ctx.font =
        'bold 52px "Zen Maru Gothic", sans-serif';

    ctx.fillText(
        "🌸 募集範囲・条件",
        70,
        y
    );

    y += 70;

    ctx.font =
        '46px "Zen Maru Gothic", sans-serif';

    y = drawWrappedText(

        ctx,

        "募集範囲："
        + document.getElementById("range").value,

        70,

        y,

        940,

        58

    );

    y = drawWrappedText(

        ctx,

        "条件："
        + document.getElementById("condition").value,

        70,

        y,

        940,

        58

    );

    // --------------------------
    // 応募方法
    // --------------------------

    const methods = [];

    if (
        document.getElementById("reply").checked
    ) {

        methods.push("リプライ");

    }

    if (
        document.getElementById("like").checked
    ) {

        methods.push("いいね");

    }

    if (
        document.getElementById("dm").checked
    ) {

        methods.push("DM");

    }

    y += 10;

    y = drawWrappedText(

        ctx,

        "応募方法：" +
        methods.join("・"),

        70,

        y,

        940,

        58

    );

    // --------------------------
    // 作品名
    // --------------------------

    y += 20;

    ctx.font =
        'bold 52px "Zen Maru Gothic", sans-serif';

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

    // --------------------------
    // 募集メンバー
    // --------------------------

    y += 20;

    ctx.font =
        'bold 52px "Zen Maru Gothic", sans-serif';

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

    // --------------------------
    // 確定メンバー
    // --------------------------

    y += 30;

    ctx.font =
        'bold 52px "Zen Maru Gothic", sans-serif';

    ctx.fillText(
        "✅ 確定メンバー",
        70,
        y
    );

    y += 70;

    ctx.font =
        '42px "Zen Maru Gothic", sans-serif';

    document
        .querySelectorAll(".member-row")
        .forEach(row => {

            const character =
                row.querySelector(".member-character").value;

            const name =
                row.querySelector(".member-name").value;

            const id =
                row.querySelector(".member-id").value;

            if (
                character ||
                name ||
                id
            ) {

                ctx.fillText(

                    `${character}　${name}　@${id}`,

                    70,

                    y

                );

                y += 56;

            }

        });

    // --------------------------
    // JPEG出力
    // --------------------------

    const dataUrl =
        canvas.toDataURL(
            "image/jpeg",
            0.95
        );

    const popup =
        window.open("");

    popup.document.write(`
<!DOCTYPE html>
<html lang="ja">
<head>
<meta name="viewport"
content="width=device-width,initial-scale=1">
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
<img src="${dataUrl}">
</body>
</html>
`);

}