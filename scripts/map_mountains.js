const fs = require('fs');

async function mapAllMountains() {
  const regions = [
    { file: 'mt_hokkaido.html', region: 'hokkaido', regionName: '北海道' },
    { file: 'mt_tohoku.html', region: 'tohoku', regionName: '東北' },
    { file: 'mt_kanto.html', region: 'kanto', regionName: '関東' },
    { file: 'mt_tokai.html', region: 'tokai', regionName: '東海' },
    { file: 'mt_kinki.html', region: 'kansai', regionName: '関西' },
    { file: 'mt_shikoku.html', region: 'chugoku', regionName: '中国' }
  ];

  // Specific subpage mapping to region & areaName
  const subpageInfo = {
    // 北海道
    'mt_shiretoko.html': { region: 'hokkaido', regionName: '北海道', areaName: '知床・オホーツク' },
    'mt_soya.html': { region: 'hokkaido', regionName: '北海道', areaName: '宗谷・道北' },
    'mt_kitami.html': { region: 'hokkaido', regionName: '北海道', areaName: '北見・阿寒' },
    'mt_ishikari.html': { region: 'hokkaido', regionName: '北海道', areaName: '石狩・大雪山' },
    'mt_teshio.html': { region: 'hokkaido', regionName: '北海道', areaName: '天塩・夕張' },
    'mt_hidaka.html': { region: 'hokkaido', regionName: '北海道', areaName: '日高・十勝' },
    'mt_shikotsu.html': { region: 'hokkaido', regionName: '北海道', areaName: '支笏・洞爺・ニセコ' },
    'mt_oshima.html': { region: 'hokkaido', regionName: '北海道', areaName: '渡島・道南' },
    // 東北
    'mt_tsugaru.html': { region: 'tohoku', regionName: '東北', areaName: '津軽・下北' },
    'mt_kitakami.html': { region: 'tohoku', regionName: '東北', areaName: '北上高地' },
    'mt_ohu-north.html': { region: 'tohoku', regionName: '東北', areaName: '奥羽山脈北部(八甲田・岩手)' },
    'mt_shirakami.html': { region: 'tohoku', regionName: '東北', areaName: '白神・秋田' },
    'mt_dewa.html': { region: 'tohoku', regionName: '東北', areaName: '出羽山地(鳥海・月山)' },
    'mt_ohu-center.html': { region: 'tohoku', regionName: '東北', areaName: '奥羽山脈中央部(栗駒・焼石)' },
    'mt_ohu-south.html': { region: 'tohoku', regionName: '東北', areaName: '奥羽山脈南部(吾妻・安達太良)' },
    'mt_zao.html': { region: 'tohoku', regionName: '東北', areaName: '蔵王・宮城山形' },
    'mt_asahi.html': { region: 'tohoku', regionName: '東北', areaName: '朝日連峰' },
    'mt_iide.html': { region: 'tohoku', regionName: '東北', areaName: '飯豊連峰' },
    'mt_abukuma.html': { region: 'tohoku', regionName: '東北', areaName: '阿武隈高地' },
    'mt_aizu.html': { region: 'tohoku', regionName: '東北', areaName: '会津・尾瀬' },
    // 関東・信越・甲信
    'mt_yamizo.html': { region: 'kanto', regionName: '関東', areaName: '八溝・茨城栃木' },
    'mt_nasu.html': { region: 'kanto', regionName: '関東', areaName: '那須・日光' },
    'mt_echigo.html': { region: 'shinetsu', regionName: '信越', areaName: '越後山脈・魚沼' },
    'mt_naeba.html': { region: 'shinetsu', regionName: '信越', areaName: '苗場・谷川連峰' },
    'mt_kanto-san.html': { region: 'kanto', regionName: '関東', areaName: '関東山地・奥多摩・秩父' },
    'mt_boso.html': { region: 'kanto', regionName: '関東', areaName: '房総・三浦' },
    'mt_tanzawa.html': { region: 'kanto', regionName: '関東', areaName: '丹沢・箱根' },
    'mt_fuji.html': { region: 'tokai', regionName: '東海', areaName: '富士・富士五湖' },
    'mt_sado.html': { region: 'shinetsu', regionName: '信越', areaName: '佐渡島' },
    'mt_myoko.html': { region: 'shinetsu', regionName: '信越', areaName: '妙高・火打・黒姫' },
    'mt_yatsu.html': { region: 'shinetsu', regionName: '信越', areaName: '八ヶ岳・蓼科' },
    'mt_n-alps-north.html': { region: 'shinetsu', regionName: '信越', areaName: '北アルプス北部(白馬・立山)' },
    'mt_n-alps-south.html': { region: 'shinetsu', regionName: '信越', areaName: '北アルプス南部(槍・穂高・乗鞍)' },
    'mt_ontake.html': { region: 'tokai', regionName: '東海', areaName: '御嶽山・木曽' },
    'mt_c-alps.html': { region: 'shinetsu', regionName: '信越', areaName: '中央アルプス(木曽駒)' },
    'mt_s-alps-north.html': { region: 'shinetsu', regionName: '信越', areaName: '南アルプス北部(甲斐駒・仙丈・北岳)' },
    'mt_s-alps-south.html': { region: 'shinetsu', regionName: '信越', areaName: '南アルプス南部(赤石・聖)' },
    'mt_minobu.html': { region: 'tokai', regionName: '東海', areaName: '身延・山梨静岡' },
    // 東海・北陸
    'mt_mino.html': { region: 'tokai', regionName: '東海', areaName: '奥美濃・能郷白山' },
    'mt_noto.html': { region: 'hokuriku', regionName: '北陸', areaName: '能登半島' },
    'mt_hida.html': { region: 'tokai', regionName: '東海', areaName: '飛騨・奥飛騨' },
    'mt_hakusan.html': { region: 'hokuriku', regionName: '北陸', areaName: '白山連峰・加賀越前' },
    'mt_ibuki.html': { region: 'kansai', regionName: '関西', areaName: '伊吹山・鈴鹿北部' },
    // 近畿・西日本
    'mt_suzuka.html': { region: 'kansai', regionName: '関西', areaName: '鈴鹿山脈' },
    'mt_biwako.html': { region: 'kansai', regionName: '関西', areaName: '比良・比叡・琵琶湖西岸' },
    'mt_nara.html': { region: 'kansai', regionName: '関西', areaName: '大峰・大台ヶ原' },
    'mt_ikoma.html': { region: 'kansai', regionName: '関西', areaName: '生駒・金剛・和泉' },
    'mt_tanba.html': { region: 'kansai', regionName: '関西', areaName: '丹波・京都丹後' },
    'mt_rokko.html': { region: 'kansai', regionName: '関西', areaName: '六甲・播磨' },
    // 中国・四国・九州
    'mt_chugoku-east.html': { region: 'chugoku', regionName: '中国', areaName: '氷ノ山・因伯' },
    'mt_kibi-east.html': { region: 'chugoku', regionName: '中国', areaName: '吉備・岡山' },
    'mt_chugoku-center.html': { region: 'chugoku', regionName: '中国', areaName: '大山・蒜山・伯耆' },
    'mt_kibi-west.html': { region: 'chugoku', regionName: '中国', areaName: '吉備西部・備後' },
    'mt_chugoku-west.html': { region: 'chugoku', regionName: '中国', areaName: '西中国山地(恐羅漢・冠山)' },
    'mt_tsukushi.html': { region: 'chugoku', regionName: '中国', areaName: '四国山地・石鎚・剣山' },
    'mt_aso.html': { region: 'chugoku', regionName: '中国', areaName: '阿蘇・くじゅう連山' },
    'mt_kyushu.html': { region: 'chugoku', regionName: '中国', areaName: '九州山地・霧島' }
  };

  const mtToSubpage = {};
  for (const [subpage, meta] of Object.entries(subpageInfo)) {
    try {
      const res = await fetch('https://powdersearch.jp/' + subpage);
      if (!res.ok) continue;
      const buf = await res.arrayBuffer();
      const iconv = new TextDecoder('shift_jis');
      const text = iconv.decode(buf);
      const matches = [...text.matchAll(/href="(mt[0-9]+\.html)"/gi)];
      for (const m of matches) {
        mtToSubpage[m[1]] = meta;
      }
    } catch (e) {
      console.error(subpage, e.message);
    }
  }

  console.log('Total mapped mountains from PowderSearch subpages:', Object.keys(mtToSubpage).length);
  fs.writeFileSync('scripts/mt_subpage_mapping.json', JSON.stringify(mtToSubpage, null, 2), 'utf8');
}

mapAllMountains();
