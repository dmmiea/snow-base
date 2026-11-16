// 全国バックカントリー定番150座 マスターデータ
// 選定ソース: 『山スキールート212』『山スキー百山1・2』・STEEP・ヤマレコ/YAMAP冬期実績
// region は index.html のエリアフィルタ互換 (西日本・四国・九州は 'chugoku')

export const BC_MASTER_SPOTS = [
  // ========================
  // 北海道 (28座)
  // ========================
  {
    id: 'bc_rishirizan',
    name: '利尻山 (利尻富士)',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '宗谷・道北',
    slopeOrientation: 'ALL',
    top: { lat: 45.1786, lon: 141.2419, elevation: 1721, label: '利尻山山頂' },
    base: { lat: 45.2208, lon: 141.2300, elevation: 210, label: '北麓野営場登山口' }
  },
  {
    id: 'bc_mokotoyama',
    name: '藻琴山',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '知床・オホーツク',
    slopeOrientation: 'N',
    top: { lat: 43.7044, lon: 144.331, elevation: 1000, label: '藻琴山山頂' },
    base: { lat: 43.6819, lon: 144.3247, elevation: 725, label: 'ハイランド小清水725' }
  },
  {
    id: 'bc_unabetsudake',
    name: '海別岳',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '知床・オホーツク',
    slopeOrientation: 'NW',
    top: { lat: 43.8764, lon: 144.8783, elevation: 1419, label: '海別岳山頂' },
    base: { lat: 43.9100, lon: 144.8420, elevation: 200, label: '峰浜登山口' }
  },
  {
    id: 'bc_chishibetsudake',
    name: '知西別岳',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '知床・オホーツク',
    slopeOrientation: 'E',
    top: { lat: 44.0223, lon: 145.0512, elevation: 1317, label: '知西別岳山頂' },
    base: { lat: 44.0553, lon: 145.1061, elevation: 738, label: '知床峠' }
  },
  {
    id: 'bc_rausudake',
    name: '羅臼岳',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '知床・オホーツク',
    slopeOrientation: 'SE',
    top: { lat: 44.0758, lon: 145.1222, elevation: 1661, label: '羅臼岳山頂' },
    base: { lat: 44.0417, lon: 145.1583, elevation: 220, label: '羅臼温泉登山口' }
  },
  {
    id: 'bc_sharidake',
    name: '斜里岳',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '知床・オホーツク',
    slopeOrientation: 'NW',
    top: { lat: 43.7658, lon: 144.7175, elevation: 1547, label: '斜里岳山頂' },
    base: { lat: 43.7972, lon: 144.6967, elevation: 400, label: '清岳荘登山口' }
  },
  {
    id: 'bc_asahidake',
    name: '大雪山 (旭岳)',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '大雪・十勝',
    slopeOrientation: 'W',
    top: { lat: 43.6636, lon: 142.8542, elevation: 2291, label: '旭岳山頂' },
    base: { lat: 43.6589, lon: 142.8264, elevation: 1600, label: '大雪山旭岳ロープウェイ姿見駅' }
  },
  {
    id: 'bc_kurodake',
    name: '大雪山 (黒岳)',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '大雪・十勝',
    slopeOrientation: 'NE',
    top: { lat: 43.6975, lon: 142.9203, elevation: 1984, label: '黒岳山頂' },
    base: { lat: 43.7089, lon: 142.9317, elevation: 1520, label: '黒岳ペアリフト七合目駅' }
  },
  {
    id: 'bc_tokachidake',
    name: '十勝岳',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '大雪・十勝',
    slopeOrientation: 'NW',
    top: { lat: 43.4178, lon: 142.6864, elevation: 2077, label: '十勝岳本峰山頂' },
    base: { lat: 43.4314, lon: 142.6458, elevation: 1036, label: '白銀荘・十勝岳温泉登山口' }
  },
  {
    id: 'bc_maetokachi',
    name: '前十勝',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '大雪・十勝',
    slopeOrientation: 'W',
    top: { lat: 43.4236, lon: 142.673, elevation: 1733, label: '前十勝山頂' },
    base: { lat: 43.4139, lon: 142.6331, elevation: 1280, label: '十勝岳温泉・凌雲閣' }
  },
  {
    id: 'bc_sandanyama',
    name: '三段山',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '大雪・十勝',
    slopeOrientation: 'NW',
    top: { lat: 43.4135, lon: 142.6653, elevation: 1748, label: '三段山山頂' },
    base: { lat: 43.4314, lon: 142.6458, elevation: 1036, label: '吹上温泉・白銀荘' }
  },
  {
    id: 'bc_furanodake',
    name: '富良野岳',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '大雪・十勝',
    slopeOrientation: 'NW',
    top: { lat: 43.3939, lon: 142.6347, elevation: 1912, label: '富良野岳山頂' },
    base: { lat: 43.4139, lon: 142.6331, elevation: 1280, label: '十勝岳温泉・凌雲閣' }
  },
  {
    id: 'bc_optateshike',
    name: 'オプタテシケ山',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '大雪・十勝',
    slopeOrientation: 'NW',
    top: { lat: 43.4706, lon: 142.7517, elevation: 2013, label: 'オプタテシケ山山頂' },
    base: { lat: 43.4856, lon: 142.6950, elevation: 1050, label: '美瑛富士登山口' }
  },
  {
    id: 'bc_ashibetsudake',
    name: '芦別岳',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '道央・富良野',
    slopeOrientation: 'E',
    top: { lat: 43.2356, lon: 142.2836, elevation: 1726, label: '芦別岳山頂' },
    base: { lat: 43.2550, lon: 142.3239, elevation: 430, label: '山部・芦別岳旧道登山口' }
  },
  {
    id: 'bc_shokanbetsudake',
    name: '暑寒別岳',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '増毛・道央',
    slopeOrientation: 'N',
    top: { lat: 43.7158, lon: 141.5228, elevation: 1491, label: '暑寒別岳山頂' },
    base: { lat: 43.7600, lon: 141.5450, elevation: 320, label: '暑寒荘登山口' }
  },
  {
    id: 'bc_memurodake',
    name: '芽室岳',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '日高・十勝',
    slopeOrientation: 'NE',
    top: { lat: 42.8694, lon: 142.7850, elevation: 1754, label: '芽室岳山頂' },
    base: { lat: 42.8936, lon: 142.8153, elevation: 620, label: '芽室岳登山口' }
  },
  {
    id: 'bc_sapporodake',
    name: '札幌岳',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '札幌・定山渓',
    slopeOrientation: 'N',
    top: { lat: 42.9006, lon: 141.1986, elevation: 1293, label: '札幌岳山頂' },
    base: { lat: 42.9317, lon: 141.1856, elevation: 450, label: '豊滝・冷水小屋登山口' }
  },
  {
    id: 'bc_asaridake',
    name: '朝里岳',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '札幌・小樽・キロロ',
    slopeOrientation: 'N',
    top: { lat: 43.0614, lon: 141.0452, elevation: 1281, label: '朝里岳山頂' },
    base: { lat: 43.0772, lon: 141.0058, elevation: 1180, label: 'キロロ・朝里第2エクスプレス山頂' }
  },
  {
    id: 'bc_harukayama',
    name: '春香山',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '札幌・小樽',
    slopeOrientation: 'N',
    top: { lat: 43.1136, lon: 141.1036, elevation: 907, label: '春香山山頂' },
    base: { lat: 43.1339, lon: 141.1489, elevation: 250, label: '張碓・銀嶺荘登山口' }
  },
  {
    id: 'bc_teineyama',
    name: '手稲山 (奥手稲山)',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '札幌・小樽',
    slopeOrientation: 'N',
    top: { lat: 43.0761, lon: 141.1950, elevation: 1023, label: '手稲山山頂' },
    base: { lat: 43.0819, lon: 141.2014, elevation: 940, label: 'サッポロテイネ山頂駅' }
  },
  {
    id: 'bc_yoichidake',
    name: '余市岳',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '札幌・小樽・キロロ',
    slopeOrientation: 'NW',
    top: { lat: 43.0327, lon: 141.0198, elevation: 1488, label: '余市岳山頂' },
    base: { lat: 43.0686, lon: 140.9853, elevation: 1080, label: 'キロロ・長峰第2リフト終点' }
  },
  {
    id: 'bc_shakotandake',
    name: '積丹岳',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '積丹・余市',
    slopeOrientation: 'N',
    top: { lat: 43.2706, lon: 140.4804, elevation: 1255, label: '積丹岳山頂' },
    base: { lat: 43.3019, lon: 140.4914, elevation: 400, label: '積丹岳休憩所登山口' }
  },
  {
    id: 'bc_yoteizan',
    name: '羊蹄山 (後方羊蹄山)',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: 'ニセコ・羊蹄',
    slopeOrientation: 'ALL',
    top: { lat: 42.8267, lon: 140.8114, elevation: 1898, label: '羊蹄山最高点（火口縁）' },
    base: { lat: 42.7969, lon: 140.7931, elevation: 430, label: '真狩登山口・羊蹄自然公園' }
  },
  {
    id: 'bc_niseko_annupuri',
    name: 'ニセコアンヌプリ',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: 'ニセコ・羊蹄',
    slopeOrientation: 'ALL',
    top: { lat: 42.8750, lon: 140.6589, elevation: 1308, label: 'ニセコアンヌプリ山頂' },
    base: { lat: 42.8669, lon: 140.6556, elevation: 1150, label: 'ニセコ花園・グランヒラフ山頂ゲート' }
  },
  {
    id: 'bc_iwaonupuri',
    name: 'イワオヌプリ',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: 'ニセコ・羊蹄',
    slopeOrientation: 'S',
    top: { lat: 42.8856, lon: 140.6400, elevation: 1116, label: 'イワオヌプリ山頂' },
    base: { lat: 42.8819, lon: 140.6564, elevation: 750, label: '五色温泉インフォメーションセンター' }
  },
  {
    id: 'bc_chisenupuri',
    name: 'チセヌプリ',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: 'ニセコ・羊蹄',
    slopeOrientation: 'S',
    top: { lat: 42.8881, lon: 140.5967, elevation: 1134, label: 'チセヌプリ山頂' },
    base: { lat: 42.8772, lon: 140.5950, elevation: 620, label: 'チセヌプリ山麓・湯本温泉' }
  },
  {
    id: 'bc_raidensan',
    name: '雷電山',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: 'ニセコ・道南',
    slopeOrientation: 'N',
    top: { lat: 42.9022, lon: 140.4694, elevation: 1212, label: '雷電山山頂' },
    base: { lat: 42.9278, lon: 140.4667, elevation: 230, label: '朝日温泉登山口' }
  },
  {
    id: 'bc_karibayama',
    name: '狩場山',
    region: 'hokkaido', regionName: '北海道', prefecture: '北海道', areaName: '渡島・道南',
    slopeOrientation: 'E',
    top: { lat: 42.6131, lon: 139.9403, elevation: 1520, label: '狩場山山頂' },
    base: { lat: 42.6250, lon: 139.9889, elevation: 550, label: '真駒内コース登山口' }
  },

  // ========================
  // 東北 (32座)
  // ========================
  {
    id: 'bc_iwakisan',
    name: '岩木山',
    region: 'tohoku', regionName: '東北', prefecture: '青森県', areaName: '津軽・岩木山',
    slopeOrientation: 'S',
    top: { lat: 40.6558, lon: 140.3031, elevation: 1625, label: '岩木山山頂' },
    base: { lat: 40.6250, lon: 140.2856, elevation: 450, label: '嶽温泉・百沢スキー場上部' }
  },
  {
    id: 'bc_hakkoda',
    name: '八甲田山 (大岳)',
    region: 'tohoku', regionName: '東北', prefecture: '青森県', areaName: '八甲田',
    slopeOrientation: 'ALL',
    top: { lat: 40.6589, lon: 140.8775, elevation: 1585, label: '八甲田大岳山頂' },
    base: { lat: 40.6486, lon: 140.8506, elevation: 900, label: '酸ヶ湯温泉・八甲田ロープウェー' }
  },
  {
    id: 'bc_kushigamine',
    name: '南八甲田 (櫛ヶ峰)',
    region: 'tohoku', regionName: '東北', prefecture: '青森県', areaName: '八甲田',
    slopeOrientation: 'E',
    top: { lat: 40.6032, lon: 140.8426, elevation: 1517, label: '櫛ヶ峰山頂' },
    base: { lat: 40.6186, lon: 140.8925, elevation: 750, label: '猿倉温泉登山口' }
  },
  {
    id: 'bc_hachimantai',
    name: '八幡平',
    region: 'tohoku', regionName: '東北', prefecture: '岩手県', areaName: '八幡平・岩手山',
    slopeOrientation: 'NE',
    top: { lat: 39.9578, lon: 140.8542, elevation: 1613, label: '八幡平山頂' },
    base: { lat: 39.9617, lon: 140.9108, elevation: 1050, label: '八幡平スキー場跡・御在所' }
  },
  {
    id: 'bc_iwatesan',
    name: '岩手山',
    region: 'tohoku', regionName: '東北', prefecture: '岩手県', areaName: '八幡平・岩手山',
    slopeOrientation: 'SE',
    top: { lat: 39.8525, lon: 141.0008, elevation: 2038, label: '岩手山山頂（薬師岳）' },
    base: { lat: 39.8256, lon: 141.0319, elevation: 630, label: '馬返し登山口' }
  },
  {
    id: 'bc_hayachine',
    name: '早池峰山',
    region: 'tohoku', regionName: '東北', prefecture: '岩手県', areaName: '北上山地',
    slopeOrientation: 'S',
    top: { lat: 39.5586, lon: 141.4889, elevation: 1917, label: '早池峰山山頂' },
    base: { lat: 39.5394, lon: 141.4667, elevation: 880, label: '河原の坊・小田越方面' }
  },
  {
    id: 'bc_moriyoshizan',
    name: '森吉山',
    region: 'tohoku', regionName: '東北', prefecture: '秋田県', areaName: '秋田・森吉',
    slopeOrientation: 'N',
    top: { lat: 39.9769, lon: 140.5442, elevation: 1454, label: '森吉山山頂（向岳）' },
    base: { lat: 39.9917, lon: 140.5333, elevation: 1160, label: '森吉山阿仁スキー場ゴンドラ山頂駅' }
  },
  {
    id: 'bc_nyutozan',
    name: '乳頭山 (烏帽子岳)',
    region: 'tohoku', regionName: '東北', prefecture: '秋田県', areaName: '田沢湖・秋田駒',
    slopeOrientation: 'W',
    top: { lat: 39.8047, lon: 140.8389, elevation: 1478, label: '乳頭山山頂' },
    base: { lat: 39.7972, lon: 140.7994, elevation: 720, label: '乳頭温泉郷・蟹場温泉' }
  },
  {
    id: 'bc_akitakomagatake',
    name: '秋田駒ヶ岳',
    region: 'tohoku', regionName: '東北', prefecture: '秋田県', areaName: '田沢湖・秋田駒',
    slopeOrientation: 'W',
    top: { lat: 39.7611, lon: 140.7994, elevation: 1637, label: '秋田駒ヶ岳（男女岳）' },
    base: { lat: 39.7769, lon: 140.7519, elevation: 720, label: 'アルパこまくさ・たざわ湖スキー場上部' }
  },
  {
    id: 'bc_wagadake',
    name: '和賀岳',
    region: 'tohoku', regionName: '東北', prefecture: '岩手県', areaName: '奥羽山脈中央',
    slopeOrientation: 'E',
    top: { lat: 39.5706, lon: 140.7525, elevation: 1440, label: '和賀岳山頂' },
    base: { lat: 39.5567, lon: 140.8050, elevation: 550, label: '高下登山口' }
  },
  {
    id: 'bc_yakeishidake',
    name: '焼石岳',
    region: 'tohoku', regionName: '東北', prefecture: '岩手県', areaName: '奥羽山脈中央',
    slopeOrientation: 'SE',
    top: { lat: 39.1636, lon: 140.8289, elevation: 1548, label: '焼石岳山頂' },
    base: { lat: 39.1467, lon: 140.8750, elevation: 680, label: '中沼登山口' }
  },
  {
    id: 'bc_kurikomayama',
    name: '栗駒山',
    region: 'tohoku', regionName: '東北', prefecture: '宮城県', areaName: '栗駒・奥羽中央',
    slopeOrientation: 'SE',
    top: { lat: 38.9611, lon: 140.7883, elevation: 1627, label: '栗駒山山頂' },
    base: { lat: 38.9403, lon: 140.8167, elevation: 1110, label: 'いわかがみ平' }
  },
  {
    id: 'bc_chokaisan',
    name: '鳥海山 (新山)',
    region: 'tohoku', regionName: '東北', prefecture: '山形県', areaName: '鳥海・出羽',
    slopeOrientation: 'ALL',
    top: { lat: 39.0992, lon: 140.0489, elevation: 2236, label: '鳥海山（新山）山頂' },
    base: { lat: 39.0706, lon: 140.0044, elevation: 1150, label: '鉾立登山口（鳥海ブルーライン）' }
  },
  {
    id: 'bc_gassan',
    name: '月山',
    region: 'tohoku', regionName: '東北', prefecture: '山形県', areaName: '月山・出羽',
    slopeOrientation: 'S',
    top: { lat: 38.5492, lon: 140.0269, elevation: 1984, label: '月山山頂' },
    base: { lat: 38.5211, lon: 140.0089, elevation: 1150, label: '姥沢・月山スキー場リフト下駅' }
  },
  {
    id: 'bc_yudonosan',
    name: '湯殿山',
    region: 'tohoku', regionName: '東北', prefecture: '山形県', areaName: '月山・出羽',
    slopeOrientation: 'SW',
    top: { lat: 38.531, lon: 139.9847, elevation: 1500, label: '湯殿山山頂' },
    base: { lat: 38.5083, lon: 139.9578, elevation: 680, label: '湯殿山スキー場・仙人沢' }
  },
  {
    id: 'bc_ubagatake',
    name: '姥ヶ岳 (月山)',
    region: 'tohoku', regionName: '東北', prefecture: '山形県', areaName: '月山・出羽',
    slopeOrientation: 'SE',
    top: { lat: 38.5363, lon: 140.006, elevation: 1670, label: '姥ヶ岳山頂' },
    base: { lat: 38.5211, lon: 140.0089, elevation: 1150, label: '月山姥沢駐車場' }
  },
  {
    id: 'bc_murayamahayama',
    name: '村山葉山',
    region: 'tohoku', regionName: '東北', prefecture: '山形県', areaName: '月山・出羽',
    slopeOrientation: 'E',
    top: { lat: 38.5293, lon: 140.2105, elevation: 1462, label: '村山葉山山頂' },
    base: { lat: 38.5236, lon: 140.2464, elevation: 550, label: '葉山市民荘・大類登山口' }
  },
  {
    id: 'bc_funagatayama',
    name: '船形山 (御所山)',
    region: 'tohoku', regionName: '東北', prefecture: '宮城県', areaName: '蔵王・船形',
    slopeOrientation: 'E',
    top: { lat: 38.4556, lon: 140.6203, elevation: 1500, label: '船形山山頂' },
    base: { lat: 38.4450, lon: 140.6650, elevation: 720, label: '旗坂キャンプ場登山口' }
  },
  {
    id: 'bc_zao',
    name: '蔵王連峰 (熊野岳)',
    region: 'tohoku', regionName: '東北', prefecture: '山形県', areaName: '蔵王・宮城山形',
    slopeOrientation: 'W',
    top: { lat: 38.1436, lon: 140.4394, elevation: 1841, label: '熊野岳山頂' },
    base: { lat: 38.1517, lon: 140.4228, elevation: 1661, label: '蔵王ロープウェイ地蔵山頂駅' }
  },
  {
    id: 'bc_ooasahidake',
    name: '大朝日岳',
    region: 'tohoku', regionName: '東北', prefecture: '山形県', areaName: '朝日連峰',
    slopeOrientation: 'E',
    top: { lat: 38.2606, lon: 139.9222, elevation: 1870, label: '大朝日岳山頂' },
    base: { lat: 38.2889, lon: 139.9694, elevation: 750, label: '古寺鉱泉登山口' }
  },
  {
    id: 'bc_iidesan',
    name: '飯豊山',
    region: 'tohoku', regionName: '東北', prefecture: '福島県', areaName: '飯豊連峰',
    slopeOrientation: 'S',
    top: { lat: 37.8547, lon: 139.7072, elevation: 2105, label: '飯豊山山頂（本山）' },
    base: { lat: 37.8017, lon: 139.7272, elevation: 550, label: '川入・御沢野営場' }
  },
  {
    id: 'bc_kitamatadake',
    name: '北股岳 (飯豊連峰)',
    region: 'tohoku', regionName: '東北', prefecture: '山形県', areaName: '飯豊連峰',
    slopeOrientation: 'N',
    top: { lat: 37.8799, lon: 139.6386, elevation: 2025, label: '北股岳山頂' },
    base: { lat: 37.9350, lon: 139.6800, elevation: 430, label: '飯豊山荘・温身平' }
  },
  {
    id: 'bc_nishiazuma',
    name: '西吾妻山',
    region: 'tohoku', regionName: '東北', prefecture: '山形県', areaName: '吾妻・猪苗代',
    slopeOrientation: 'N',
    top: { lat: 37.7378, lon: 140.1411, elevation: 2035, label: '西吾妻山山頂' },
    base: { lat: 37.7611, lon: 140.1389, elevation: 1820, label: '天元台高原・北望台リフトトップ' }
  },
  {
    id: 'bc_issaikyozan',
    name: '一切経山 (東吾妻)',
    region: 'tohoku', regionName: '東北', prefecture: '福島県', areaName: '吾妻・猪苗代',
    slopeOrientation: 'S',
    top: { lat: 37.7350, lon: 140.2442, elevation: 1949, label: '一切経山山頂' },
    base: { lat: 37.7106, lon: 140.2528, elevation: 1600, label: '浄土平駐車場' }
  },
  {
    id: 'bc_adatarayama',
    name: '安達太良山',
    region: 'tohoku', regionName: '東北', prefecture: '福島県', areaName: '吾妻・安達太良',
    slopeOrientation: 'E',
    top: { lat: 37.6208, lon: 140.2867, elevation: 1700, label: '安達太良山山頂' },
    base: { lat: 37.6200, lon: 140.3125, elevation: 1350, label: 'あだたらエクスプレス山頂駅' }
  },
  {
    id: 'bc_minowayama',
    name: '箕輪山',
    region: 'tohoku', regionName: '東北', prefecture: '福島県', areaName: '吾妻・安達太良',
    slopeOrientation: 'N',
    top: { lat: 37.6472, lon: 140.2811, elevation: 1728, label: '箕輪山山頂' },
    base: { lat: 37.6736, lon: 140.2739, elevation: 1450, label: '箕輪スキー場トップ' }
  },
  {
    id: 'bc_bandaisan',
    name: '磐梯山',
    region: 'tohoku', regionName: '東北', prefecture: '福島県', areaName: '吾妻・猪苗代',
    slopeOrientation: 'N',
    top: { lat: 37.6011, lon: 140.0722, elevation: 1816, label: '磐梯山山頂' },
    base: { lat: 37.6208, lon: 140.0789, elevation: 1050, label: '裏磐梯スキー場ベース' }
  },
  {
    id: 'bc_hakaseyama',
    name: '博士山',
    region: 'tohoku', regionName: '東北', prefecture: '福島県', areaName: '会津・尾瀬',
    slopeOrientation: 'N',
    top: { lat: 37.3653, lon: 139.7131, elevation: 1482, label: '博士山山頂' },
    base: { lat: 37.3900, lon: 139.7150, elevation: 550, label: '博士山登山口（柳津側）' }
  },
  {
    id: 'bc_aizuasahidake',
    name: '会津朝日岳',
    region: 'tohoku', regionName: '東北', prefecture: '福島県', areaName: '会津・尾瀬',
    slopeOrientation: 'N',
    top: { lat: 37.2211, lon: 139.3396, elevation: 1624, label: '会津朝日岳山頂' },
    base: { lat: 37.2583, lon: 139.3278, elevation: 520, label: 'いわなの里・赤倉沢登山口' }
  },
  {
    id: 'bc_aizukomagatake',
    name: '会津駒ヶ岳',
    region: 'tohoku', regionName: '東北', prefecture: '福島県', areaName: '会津・尾瀬',
    slopeOrientation: 'N',
    top: { lat: 37.0469, lon: 139.3544, elevation: 2133, label: '会津駒ヶ岳山頂' },
    base: { lat: 37.0772, lon: 139.3522, elevation: 940, label: '滝沢登山口（檜枝岐）' }
  },
  {
    id: 'bc_mitsuiwadake',
    name: '三岩岳',
    region: 'tohoku', regionName: '東北', prefecture: '福島県', areaName: '会津・尾瀬',
    slopeOrientation: 'NW',
    top: { lat: 37.0819, lon: 139.3797, elevation: 2065, label: '三岩岳山頂' },
    base: { lat: 37.1089, lon: 139.4256, elevation: 980, label: '小豆温泉・窓明山登山口' }
  },
  {
    id: 'bc_hiuchigatake',
    name: '燧ヶ岳',
    region: 'tohoku', regionName: '東北', prefecture: '福島県', areaName: '会津・尾瀬',
    slopeOrientation: 'N',
    top: { lat: 36.9551, lon: 139.2854, elevation: 2356, label: '燧ヶ岳（柴安嵓）' },
    base: { lat: 36.9889, lon: 139.3056, elevation: 1510, label: '御池登山口' }
  },

  // ========================
  // 北関東・尾瀬 (7座)
  // ========================
  {
    id: 'bc_nasudake',
    name: '那須岳 (三本槍岳・茶臼岳)',
    region: 'kanto', regionName: '関東', prefecture: '栃木県', areaName: '那須・日光',
    slopeOrientation: 'E',
    top: { lat: 37.1503, lon: 139.9614, elevation: 1917, label: '三本槍岳山頂' },
    base: { lat: 37.1186, lon: 139.9742, elevation: 1460, label: '峠の茶屋駐車場' }
  },
  {
    id: 'bc_akanagiyama',
    name: '赤薙山',
    region: 'kanto', regionName: '関東', prefecture: '栃木県', areaName: '那須・日光',
    slopeOrientation: 'E',
    top: { lat: 36.8092, lon: 139.5692, elevation: 2010, label: '赤薙山山頂' },
    base: { lat: 36.8267, lon: 139.6100, elevation: 1350, label: '霧降高原キスゲ平' }
  },
  {
    id: 'bc_nikkoshirane',
    name: '日光白根山',
    region: 'kanto', regionName: '関東', prefecture: '群馬県', areaName: '那須・日光・片品',
    slopeOrientation: 'W',
    top: { lat: 36.7983, lon: 139.3761, elevation: 2578, label: '日光白根山（奥白根）山頂' },
    base: { lat: 36.8056, lon: 139.3422, elevation: 2000, label: '丸沼高原・日光白根山ロープウェイ山頂駅' }
  },
  {
    id: 'bc_shibutsusan',
    name: '至仏山',
    region: 'kanto', regionName: '関東', prefecture: '群馬県', areaName: '尾瀬・片品',
    slopeOrientation: 'SE',
    top: { lat: 36.9033, lon: 139.1742, elevation: 2228, label: '至仏山山頂' },
    base: { lat: 36.8722, lon: 139.2089, elevation: 1591, label: '鳩待峠' }
  },
  {
    id: 'bc_keizuruyama',
    name: '景鶴山',
    region: 'kanto', regionName: '関東', prefecture: '群馬県', areaName: '尾瀬・片品',
    slopeOrientation: 'S',
    top: { lat: 36.957, lon: 139.2107, elevation: 2004, label: '景鶴山山頂' },
    base: { lat: 36.9350, lon: 139.2350, elevation: 1400, label: '尾瀬ヶ原・竜宮十字路方面' }
  },
  {
    id: 'bc_hotakayama',
    name: '上州武尊山',
    region: 'kanto', regionName: '関東', prefecture: '群馬県', areaName: 'みなかみ・片品',
    slopeOrientation: 'W',
    top: { lat: 36.8053, lon: 139.1322, elevation: 2158, label: '武尊山（沖武尊）山頂' },
    base: { lat: 36.7839, lon: 139.1069, elevation: 1870, label: '川場スキー場・剣ヶ峰山トップ' }
  },
  {
    id: 'bc_akagiyama',
    name: '赤城山 (黒檜山)',
    region: 'kanto', regionName: '関東', prefecture: '群馬県', areaName: '赤城・北関東',
    slopeOrientation: 'SW',
    top: { lat: 36.5600, lon: 139.1931, elevation: 1828, label: '黒檜山山頂' },
    base: { lat: 36.5514, lon: 139.1764, elevation: 1360, label: '赤城大沼・黒檜山登山口' }
  },

  // ========================
  // 上信越・妙高・谷川 (31座)
  // ========================
  {
    id: 'bc_asakusadake',
    name: '浅草岳',
    region: 'shinetsu', regionName: '信越', prefecture: '新潟県', areaName: '魚沼・越後',
    slopeOrientation: 'NW',
    top: { lat: 37.3436, lon: 139.2339, elevation: 1585, label: '浅草岳山頂' },
    base: { lat: 37.3667, lon: 139.2014, elevation: 620, label: 'ネズモチ平登山口' }
  },
  {
    id: 'bc_sumondake',
    name: '守門岳',
    region: 'shinetsu', regionName: '信越', prefecture: '新潟県', areaName: '魚沼・越後',
    slopeOrientation: 'W',
    top: { lat: 37.3977, lon: 139.1366, elevation: 1537, label: '守門岳（袴岳）山頂' },
    base: { lat: 37.4167, lon: 139.1125, elevation: 580, label: '保久礼・二口登山口' }
  },
  {
    id: 'bc_echigokomagatake',
    name: '越後駒ヶ岳',
    region: 'shinetsu', regionName: '信越', prefecture: '新潟県', areaName: '魚沼・越後',
    slopeOrientation: 'E',
    top: { lat: 37.1228, lon: 139.0750, elevation: 2003, label: '越後駒ヶ岳山頂' },
    base: { lat: 37.1264, lon: 139.1244, elevation: 1065, label: '枝折峠登山口' }
  },
  {
    id: 'bc_makihata',
    name: '巻機山',
    region: 'shinetsu', regionName: '信越', prefecture: '新潟県', areaName: '湯沢・谷川',
    slopeOrientation: 'NW',
    top: { lat: 36.9785, lon: 138.9644, elevation: 1967, label: '巻機山（御機屋）山頂' },
    base: { lat: 37.0011, lon: 138.9189, elevation: 720, label: '桜坂駐車場（清水集落）' }
  },
  {
    id: 'bc_tanigawadake',
    name: '谷川岳',
    region: 'shinetsu', regionName: '信越', prefecture: '群馬県', areaName: '湯沢・谷川',
    slopeOrientation: 'SE',
    top: { lat: 36.8358, lon: 138.9303, elevation: 1977, label: '谷川岳（オキの耳）山頂' },
    base: { lat: 36.8264, lon: 138.9539, elevation: 1319, label: '谷川岳ロープウェイ天神平駅' }
  },
  {
    id: 'bc_asahidake_joetsu',
    name: '朝日岳 (上越)',
    region: 'shinetsu', regionName: '信越', prefecture: '群馬県', areaName: '湯沢・谷川',
    slopeOrientation: 'S',
    top: { lat: 36.8807, lon: 138.9726, elevation: 1945, label: '上越朝日岳山頂' },
    base: { lat: 36.8375, lon: 138.9675, elevation: 746, label: '土合口・白毛門登山口' }
  },
  {
    id: 'bc_shiragamon',
    name: '白毛門',
    region: 'shinetsu', regionName: '信越', prefecture: '群馬県', areaName: '湯沢・谷川',
    slopeOrientation: 'SW',
    top: { lat: 36.8595, lon: 138.9673, elevation: 1720, label: '白毛門山頂' },
    base: { lat: 36.8375, lon: 138.9675, elevation: 746, label: '土合口・白毛門登山口' }
  },
  {
    id: 'bc_tairappyo',
    name: '平標山',
    region: 'shinetsu', regionName: '信越', prefecture: '新潟県', areaName: '湯沢・谷川',
    slopeOrientation: 'W',
    top: { lat: 36.8179, lon: 138.8219, elevation: 1984, label: '平標山山頂' },
    base: { lat: 36.8094, lon: 138.7844, elevation: 950, label: '平標登山口（元橋）' }
  },
  {
    id: 'bc_sennokura',
    name: '仙ノ倉山',
    region: 'shinetsu', regionName: '信越', prefecture: '群馬県', areaName: '湯沢・谷川',
    slopeOrientation: 'N',
    top: { lat: 36.8175, lon: 138.8396, elevation: 2026, label: '仙ノ倉山山頂' },
    base: { lat: 36.8094, lon: 138.7844, elevation: 950, label: '平標登山口（元橋）' }
  },
  {
    id: 'bc_naebasan',
    name: '苗場山',
    region: 'shinetsu', regionName: '信越', prefecture: '新潟県', areaName: '湯沢・苗場',
    slopeOrientation: 'E',
    top: { lat: 36.8458, lon: 138.6903, elevation: 2145, label: '苗場山山頂' },
    base: { lat: 36.8669, lon: 138.7328, elevation: 1300, label: '祓川・和田小屋方面' }
  },
  {
    id: 'bc_kaguragamine',
    name: '神楽ヶ峰 (かぐらBC)',
    region: 'shinetsu', regionName: '信越', prefecture: '新潟県', areaName: '湯沢・苗場',
    slopeOrientation: 'NE',
    top: { lat: 36.8522, lon: 138.7041, elevation: 2030, label: '神楽ヶ峰山頂' },
    base: { lat: 36.8667, lon: 138.7333, elevation: 1845, label: 'かぐら第5ロマンスリフト終点（KG-1ゲート）' }
  },
  {
    id: 'bc_kusatsushirane',
    name: '草津白根山',
    region: 'shinetsu', regionName: '信越', prefecture: '群馬県', areaName: '志賀・草津',
    slopeOrientation: 'E',
    top: { lat: 36.6439, lon: 138.5283, elevation: 2160, label: '草津白根山（本白根山周辺）' },
    base: { lat: 36.6214, lon: 138.5678, elevation: 1550, label: '草津温泉スキー場・殺生河原' }
  },
  {
    id: 'bc_yokoteyama',
    name: '横手山',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '志賀・草津',
    slopeOrientation: 'N',
    top: { lat: 36.6708, lon: 138.5269, elevation: 2307, label: '横手山山頂' },
    base: { lat: 36.6850, lon: 138.5150, elevation: 1700, label: 'のぞき・横手山スキー場ベース' }
  },
  {
    id: 'bc_kasagatake_shiga',
    name: '笠ヶ岳 (志賀高原)',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '志賀・草津',
    slopeOrientation: 'N',
    top: { lat: 36.6766, lon: 138.4816, elevation: 2076, label: '志賀笠ヶ岳山頂' },
    base: { lat: 36.6875, lon: 138.4981, elevation: 1700, label: '熊の湯スキー場ベース' }
  },
  {
    id: 'bc_azumaya_nekodake',
    name: '四阿山・根子岳',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '菅平・浅間',
    slopeOrientation: 'W',
    top: { lat: 36.5419, lon: 138.4131, elevation: 2354, label: '四阿山山頂' },
    base: { lat: 36.5539, lon: 138.3472, elevation: 1580, label: '菅平牧場登山口' }
  },
  {
    id: 'bc_yunomaruyama',
    name: '湯ノ丸山',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '菅平・浅間',
    slopeOrientation: 'S',
    top: { lat: 36.4348, lon: 138.4009, elevation: 2101, label: '湯ノ丸山山頂' },
    base: { lat: 36.4256, lon: 138.3964, elevation: 1732, label: '地蔵峠・湯の丸スキー場' }
  },
  {
    id: 'bc_asamayama',
    name: '浅間山 (黒斑山)',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '菅平・浅間',
    slopeOrientation: 'W',
    top: { lat: 36.4052, lon: 138.4886, elevation: 2404, label: '黒斑山山頂' },
    base: { lat: 36.4044, lon: 138.4647, elevation: 1973, label: '車坂峠・高峰高原' }
  },
  {
    id: 'bc_tateshinayama',
    name: '蓼科山',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '八ヶ岳・蓼科',
    slopeOrientation: 'NW',
    top: { lat: 36.1036, lon: 138.2950, elevation: 2530, label: '蓼科山山頂' },
    base: { lat: 36.1200, lon: 138.2828, elevation: 1900, label: '七合目登山口' }
  },
  {
    id: 'bc_kirigamine',
    name: '霧ヶ峰 (車山)',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '八ヶ岳・蓼科',
    slopeOrientation: 'E',
    top: { lat: 36.1028, lon: 138.1972, elevation: 1925, label: '車山山頂' },
    base: { lat: 36.0961, lon: 138.2219, elevation: 1580, label: '車山高原スキー場ベース' }
  },
  {
    id: 'bc_nabekurayama',
    name: '鍋倉山',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '信越・飯山・野沢',
    slopeOrientation: 'S',
    top: { lat: 36.9765, lon: 138.3825, elevation: 1289, label: '鍋倉山山頂' },
    base: { lat: 36.9967, lon: 138.3833, elevation: 550, label: '温井集落・関田峠方面' }
  },
  {
    id: 'bc_kenashiyama_nozawa',
    name: '毛無山 (野沢温泉)',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '信越・飯山・野沢',
    slopeOrientation: 'NW',
    top: { lat: 36.8979, lon: 138.4867, elevation: 1650, label: '毛無山山頂' },
    base: { lat: 36.9114, lon: 138.4744, elevation: 1400, label: '野沢温泉やまびこ駅' }
  },
  {
    id: 'bc_madaraosan',
    name: '斑尾山',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '妙高・信濃町',
    slopeOrientation: 'N',
    top: { lat: 36.8374, lon: 138.2742, elevation: 1382, label: '斑尾山山頂' },
    base: { lat: 36.8469, lon: 138.2928, elevation: 1000, label: '斑尾高原スキー場' }
  },
  {
    id: 'bc_kurohimeyama',
    name: '黒姫山',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '妙高・信濃町',
    slopeOrientation: 'E',
    top: { lat: 36.8119, lon: 138.1261, elevation: 2053, label: '黒姫山山頂' },
    base: { lat: 36.8153, lon: 138.1656, elevation: 920, label: '黒姫高原・大橋登山口' }
  },
  {
    id: 'bc_iizunayama',
    name: '飯縄山',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '妙高・戸隠',
    slopeOrientation: 'E',
    top: { lat: 36.7395, lon: 138.1337, elevation: 1917, label: '飯縄山山頂' },
    base: { lat: 36.7272, lon: 138.1558, elevation: 1200, label: '一の鳥居登山口' }
  },
  {
    id: 'bc_takatsumayama',
    name: '高妻山',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '妙高・戸隠',
    slopeOrientation: 'SE',
    top: { lat: 36.7986, lon: 138.0531, elevation: 2353, label: '高妻山山頂' },
    base: { lat: 36.7744, lon: 138.0933, elevation: 1250, label: '戸隠牧場登山口' }
  },
  {
    id: 'bc_myokosan',
    name: '妙高山',
    region: 'shinetsu', regionName: '信越', prefecture: '新潟県', areaName: '妙高・火打',
    slopeOrientation: 'E',
    top: { lat: 36.8911, lon: 138.1136, elevation: 2454, label: '妙高山山頂' },
    base: { lat: 36.8639, lon: 138.1333, elevation: 1850, label: '妙高杉ノ原・三田原第3高速終点' }
  },
  {
    id: 'bc_hiuchiyama',
    name: '火打山',
    region: 'shinetsu', regionName: '信越', prefecture: '新潟県', areaName: '妙高・火打',
    slopeOrientation: 'SE',
    top: { lat: 36.9228, lon: 138.0681, elevation: 2462, label: '火打山山頂' },
    base: { lat: 36.8725, lon: 138.0589, elevation: 1300, label: '笹ヶ峰登山口' }
  },
  {
    id: 'bc_niigatayakeyama',
    name: '新潟焼山',
    region: 'shinetsu', regionName: '信越', prefecture: '新潟県', areaName: '妙高・火打',
    slopeOrientation: 'N',
    top: { lat: 36.9206, lon: 138.0361, elevation: 2400, label: '新潟焼山山頂' },
    base: { lat: 36.9539, lon: 138.0194, elevation: 550, label: '焼山温泉・早川谷登山口' }
  },
  {
    id: 'bc_hiruyamayama',
    name: '昼闇山',
    region: 'shinetsu', regionName: '信越', prefecture: '新潟県', areaName: '妙高・糸魚川',
    slopeOrientation: 'NW',
    top: { lat: 36.9404, lon: 138.0075, elevation: 1841, label: '昼闇山山頂' },
    base: { lat: 36.9600, lon: 138.0150, elevation: 520, label: '焼山温泉・アケビ平' }
  },
  {
    id: 'bc_amakazariyama',
    name: '雨飾山',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '妙高・小谷',
    slopeOrientation: 'S',
    top: { lat: 36.9019, lon: 137.9619, elevation: 1963, label: '雨飾山山頂' },
    base: { lat: 36.8767, lon: 137.9539, elevation: 1180, label: '雨飾高原キャンプ場' }
  },
  {
    id: 'bc_oonagiyama',
    name: '大渚山',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '白馬・小谷',
    slopeOrientation: 'W',
    top: { lat: 36.8615, lon: 137.9508, elevation: 1566, label: '大渚山山頂' },
    base: { lat: 36.8350, lon: 137.9439, elevation: 950, label: '湯峠登山口' }
  },

  // ========================
  // 北アルプス (25座)
  // ========================
  {
    id: 'bc_hakuba_norikura',
    name: '白馬乗鞍岳',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '白馬・小谷',
    slopeOrientation: 'E',
    top: { lat: 36.7816, lon: 137.8012, elevation: 2469, label: '白馬乗鞍岳山頂ケルン' },
    base: { lat: 36.7742, lon: 137.8358, elevation: 1829, label: '栂池自然園・ロープウェイ終点' }
  },
  {
    id: 'bc_korengeyama',
    name: '小蓮華山',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '白馬・小谷',
    slopeOrientation: 'E',
    top: { lat: 36.7737, lon: 137.7761, elevation: 2766, label: '小蓮華山山頂' },
    base: { lat: 36.7742, lon: 137.8358, elevation: 1829, label: '栂池自然園' }
  },
  {
    id: 'bc_shiroumadake',
    name: '白馬岳',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '白馬・小谷',
    slopeOrientation: 'E',
    top: { lat: 36.7586, lon: 137.7586, elevation: 2932, label: '白馬岳山頂' },
    base: { lat: 36.7494, lon: 137.8014, elevation: 1250, label: '猿倉荘登山口' }
  },
  {
    id: 'bc_hakubayarigatake',
    name: '白馬鑓ヶ岳',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '白馬・小谷',
    slopeOrientation: 'E',
    top: { lat: 36.7314, lon: 137.7554, elevation: 2903, label: '白馬鑓ヶ岳山頂' },
    base: { lat: 36.7494, lon: 137.8014, elevation: 1250, label: '猿倉荘登山口' }
  },
  {
    id: 'bc_karamatsu',
    name: '唐松岳 (八方尾根)',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '白馬・小谷',
    slopeOrientation: 'E',
    top: { lat: 36.6872, lon: 137.7546, elevation: 2696, label: '唐松岳山頂' },
    base: { lat: 36.6975, lon: 137.8017, elevation: 1830, label: '八方池山荘（リフト終点）' }
  },
  {
    id: 'bc_goryudake',
    name: '五竜岳',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '白馬・大町',
    slopeOrientation: 'E',
    top: { lat: 36.6581, lon: 137.7528, elevation: 2814, label: '五竜岳山頂' },
    base: { lat: 36.6639, lon: 137.8056, elevation: 1515, label: 'エイブル白馬五竜アルプス平駅' }
  },
  {
    id: 'bc_kashimayari',
    name: '鹿島槍ヶ岳',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '白馬・大町',
    slopeOrientation: 'E',
    top: { lat: 36.6244, lon: 137.7469, elevation: 2889, label: '鹿島槍ヶ岳山頂（南峰）' },
    base: { lat: 36.6258, lon: 137.7950, elevation: 1050, label: '大谷原登山口' }
  },
  {
    id: 'bc_jiigatake',
    name: '爺ヶ岳',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '白馬・大町',
    slopeOrientation: 'E',
    top: { lat: 36.5886, lon: 137.7511, elevation: 2670, label: '爺ヶ岳（中峰）山頂' },
    base: { lat: 36.5614, lon: 137.7239, elevation: 1433, label: '扇沢駅・柏原新道登山口' }
  },
  {
    id: 'bc_harinokidake',
    name: '針ノ木岳',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '白馬・大町',
    slopeOrientation: 'E',
    top: { lat: 36.5381, lon: 137.6845, elevation: 2821, label: '針ノ木岳山頂' },
    base: { lat: 36.5614, lon: 137.7239, elevation: 1433, label: '扇沢駅' }
  },
  {
    id: 'bc_renge_dake',
    name: '蓮華岳',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '白馬・大町',
    slopeOrientation: 'N',
    top: { lat: 36.5357, lon: 137.7106, elevation: 2799, label: '蓮華岳山頂' },
    base: { lat: 36.5614, lon: 137.7239, elevation: 1433, label: '扇沢駅' }
  },
  {
    id: 'bc_subaridake',
    name: 'スバリ岳',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '白馬・大町',
    slopeOrientation: 'E',
    top: { lat: 36.5445, lon: 137.6849, elevation: 2752, label: 'スバリ岳山頂' },
    base: { lat: 36.5614, lon: 137.7239, elevation: 1433, label: '扇沢駅' }
  },
  {
    id: 'bc_tateyama',
    name: '立山 (室堂・雄山)',
    region: 'hokuriku', regionName: '北陸', prefecture: '富山県', areaName: '立山・北アルプス',
    slopeOrientation: 'ALL',
    top: { lat: 36.5727, lon: 137.6174, elevation: 3003, label: '立山・雄山山頂' },
    base: { lat: 36.5778, lon: 137.5956, elevation: 2450, label: '室堂ターミナル' }
  },
  {
    id: 'bc_tsurugidake',
    name: '剱岳',
    region: 'hokuriku', regionName: '北陸', prefecture: '富山県', areaName: '立山・北アルプス',
    slopeOrientation: 'S',
    top: { lat: 36.6233, lon: 137.6172, elevation: 2999, label: '剱岳山頂' },
    base: { lat: 36.6019, lon: 137.6144, elevation: 2750, label: '剱沢・剱御前小舎' }
  },
  {
    id: 'bc_tsurugigozen',
    name: '剱御前',
    region: 'hokuriku', regionName: '北陸', prefecture: '富山県', areaName: '立山・北アルプス',
    slopeOrientation: 'SW',
    top: { lat: 36.6025, lon: 137.6089, elevation: 2777, label: '剱御前山頂' },
    base: { lat: 36.5778, lon: 137.5956, elevation: 2450, label: '室堂ターミナル' }
  },
  {
    id: 'bc_kekachiyama',
    name: '毛勝山',
    region: 'hokuriku', regionName: '北陸', prefecture: '富山県', areaName: '立山・北アルプス',
    slopeOrientation: 'N',
    top: { lat: 36.7011, lon: 137.5908, elevation: 2414, label: '毛勝山山頂' },
    base: { lat: 36.6833, lon: 137.5833, elevation: 620, label: '片貝山荘・東又谷' }
  },
  {
    id: 'bc_dainichidake',
    name: '大日岳 (立山連峰)',
    region: 'hokuriku', regionName: '北陸', prefecture: '富山県', areaName: '立山・北アルプス',
    slopeOrientation: 'W',
    top: { lat: 36.5998, lon: 137.5496, elevation: 2501, label: '大日岳山頂' },
    base: { lat: 36.5756, lon: 137.5236, elevation: 1080, label: '称名滝・大日岳登山口' }
  },
  {
    id: 'bc_yarigatake',
    name: '槍ヶ岳',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '北アルプス南部',
    slopeOrientation: 'SE',
    top: { lat: 36.3420, lon: 137.6476, elevation: 3180, label: '槍ヶ岳山頂' },
    base: { lat: 36.3389, lon: 137.6739, elevation: 2050, label: '槍沢ロッジ・上高地方面' }
  },
  {
    id: 'bc_okuhotakadake',
    name: '奥穂高岳',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '北アルプス南部',
    slopeOrientation: 'E',
    top: { lat: 36.2892, lon: 137.6481, elevation: 3190, label: '奥穂高岳山頂' },
    base: { lat: 36.2892, lon: 137.6725, elevation: 2309, label: '涸沢カール' }
  },
  {
    id: 'bc_kitahotakadake',
    name: '北穂高岳',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '北アルプス南部',
    slopeOrientation: 'E',
    top: { lat: 36.3026, lon: 137.6519, elevation: 3106, label: '北穂高岳山頂' },
    base: { lat: 36.2892, lon: 137.6725, elevation: 2309, label: '涸沢カール' }
  },
  {
    id: 'bc_kasagatake_kita',
    name: '笠ヶ岳 (北アルプス)',
    region: 'tokai', regionName: '東海', prefecture: '岐阜県', areaName: '飛騨・奥飛騨',
    slopeOrientation: 'W',
    top: { lat: 36.3150, lon: 137.5503, elevation: 2897, label: '笠ヶ岳山頂' },
    base: { lat: 36.2825, lon: 137.5750, elevation: 1120, label: '新穂高温泉・クリヤ谷' }
  },
  {
    id: 'bc_jonendake',
    name: '常念岳',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '北アルプス南部',
    slopeOrientation: 'E',
    top: { lat: 36.3256, lon: 137.7275, elevation: 2857, label: '常念岳山頂' },
    base: { lat: 36.3328, lon: 137.7719, elevation: 1280, label: '一ノ沢登山口' }
  },
  {
    id: 'bc_chogatake',
    name: '蝶ヶ岳',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '北アルプス南部',
    slopeOrientation: 'E',
    top: { lat: 36.2875, lon: 137.7261, elevation: 2677, label: '蝶ヶ岳山頂' },
    base: { lat: 36.2839, lon: 137.7689, elevation: 1350, label: '三股登山口' }
  },
  {
    id: 'bc_yakedake',
    name: '焼岳',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '北アルプス南部',
    slopeOrientation: 'SE',
    top: { lat: 36.2269, lon: 137.5869, elevation: 2455, label: '焼岳山頂（北峰）' },
    base: { lat: 36.2044, lon: 137.5964, elevation: 1620, label: '新中の湯登山口' }
  },
  {
    id: 'bc_norikuradake',
    name: '乗鞍岳 (剣ヶ峰)',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '乗鞍・木曽',
    slopeOrientation: 'E',
    top: { lat: 36.1064, lon: 137.5536, elevation: 3026, label: '乗鞍岳（剣ヶ峰）山頂' },
    base: { lat: 36.1136, lon: 137.5931, elevation: 2150, label: '位ヶ原山荘・Mt.乗鞍上部' }
  },
  {
    id: 'bc_ontakesan',
    name: '御嶽山 (剣ヶ峰)',
    region: 'tokai', regionName: '東海', prefecture: '岐阜県', areaName: '御嶽山・木曽',
    slopeOrientation: 'E',
    top: { lat: 35.8928, lon: 137.4803, elevation: 3067, label: '御嶽山（剣ヶ峰）山頂' },
    base: { lat: 35.8931, lon: 137.5150, elevation: 2150, label: '御岳ロープウェイ飯森高原駅' }
  },

  // ========================
  // 中央・南アルプス・富士山 (6座)
  // ========================
  {
    id: 'bc_kisokomagatake',
    name: '木曽駒ヶ岳 (千畳敷)',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '中央アルプス',
    slopeOrientation: 'SE',
    top: { lat: 35.7894, lon: 137.8044, elevation: 2956, label: '木曽駒ヶ岳山頂' },
    base: { lat: 35.7747, lon: 137.8131, elevation: 2612, label: '千畳敷駅（駒ヶ岳ロープウェイ）' }
  },
  {
    id: 'bc_nyukasayama',
    name: '入笠山',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '南アルプス北部',
    slopeOrientation: 'E',
    top: { lat: 35.8964, lon: 138.1708, elevation: 1955, label: '入笠山山頂' },
    base: { lat: 35.9086, lon: 138.1917, elevation: 1780, label: '富士見パノラマリゾート山頂駅' }
  },
  {
    id: 'bc_kitadake',
    name: '北岳',
    region: 'shinetsu', regionName: '信越', prefecture: '山梨県', areaName: '南アルプス北部',
    slopeOrientation: 'E',
    top: { lat: 35.6744, lon: 138.2389, elevation: 3193, label: '北岳山頂' },
    base: { lat: 35.6742, lon: 138.2739, elevation: 1520, label: '広河原' }
  },
  {
    id: 'bc_senjogatake',
    name: '仙丈ヶ岳',
    region: 'shinetsu', regionName: '信越', prefecture: '長野県', areaName: '南アルプス北部',
    slopeOrientation: 'NE',
    top: { lat: 35.7200, lon: 138.1836, elevation: 3033, label: '仙丈ヶ岳山頂' },
    base: { lat: 35.7433, lon: 138.2219, elevation: 2032, label: '北沢峠' }
  },
  {
    id: 'bc_kaikomagatake',
    name: '甲斐駒ヶ岳',
    region: 'shinetsu', regionName: '信越', prefecture: '山梨県', areaName: '南アルプス北部',
    slopeOrientation: 'S',
    top: { lat: 35.7575, lon: 138.2367, elevation: 2967, label: '甲斐駒ヶ岳山頂' },
    base: { lat: 35.7433, lon: 138.2219, elevation: 2032, label: '北沢峠' }
  },
  {
    id: 'bc_fujisan',
    name: '富士山',
    region: 'tokai', regionName: '東海', prefecture: '静岡県', areaName: '富士山・静岡山梨',
    slopeOrientation: 'ALL',
    top: { lat: 35.3606, lon: 138.7274, elevation: 3776, label: '富士山（剣ヶ峰）山頂' },
    base: { lat: 35.3944, lon: 138.7336, elevation: 2305, label: '富士スバルライン五合目' }
  },

  // ========================
  // 北陸・奥美濃 (12座)
  // ========================
  {
    id: 'bc_hakusan',
    name: '白山 (御前峰)',
    region: 'hokuriku', regionName: '北陸', prefecture: '石川県', areaName: '白山連峰',
    slopeOrientation: 'W',
    top: { lat: 36.1550, lon: 136.7714, elevation: 2702, label: '白山（御前峰）山頂' },
    base: { lat: 36.1356, lon: 136.7303, elevation: 1260, label: '別当出合登山口' }
  },
  {
    id: 'bc_oogawayama',
    name: '大笠山',
    region: 'hokuriku', regionName: '北陸', prefecture: '富山県', areaName: '白山連峰',
    slopeOrientation: 'E',
    top: { lat: 36.3204, lon: 136.7896, elevation: 1822, label: '大笠山山頂' },
    base: { lat: 36.3328, lon: 136.8578, elevation: 750, label: '桂湖登山口' }
  },
  {
    id: 'bc_arashimadake',
    name: '荒島岳',
    region: 'hokuriku', regionName: '北陸', prefecture: '福井県', areaName: '奥越・福井',
    slopeOrientation: 'N',
    top: { lat: 35.9344, lon: 136.6014, elevation: 1523, label: '荒島岳山頂' },
    base: { lat: 35.9594, lon: 136.6128, elevation: 420, label: '勝原スキー場跡登山口' }
  },
  {
    id: 'bc_kyogatake_fukui',
    name: '経ヶ岳 (福井)',
    region: 'hokuriku', regionName: '北陸', prefecture: '福井県', areaName: '奥越・福井',
    slopeOrientation: 'W',
    top: { lat: 36.0465, lon: 136.6219, elevation: 1625, label: '経ヶ岳山頂' },
    base: { lat: 36.0650, lon: 136.5356, elevation: 1320, label: 'スキージャム勝山上部' }
  },
  {
    id: 'bc_toritateyama',
    name: '取立山',
    region: 'hokuriku', regionName: '北陸', prefecture: '福井県', areaName: '奥越・白山',
    slopeOrientation: 'W',
    top: { lat: 36.1069, lon: 136.6088, elevation: 1307, label: '取立山山頂' },
    base: { lat: 36.1031, lon: 136.5886, elevation: 750, label: '取立山駐車場登山口' }
  },
  {
    id: 'bc_ginkyo_mine',
    name: '銀杏峰',
    region: 'hokuriku', regionName: '北陸', prefecture: '福井県', areaName: '奥越・福井',
    slopeOrientation: 'N',
    top: { lat: 35.8866, lon: 136.4648, elevation: 1441, label: '銀杏峰山頂' },
    base: { lat: 35.9014, lon: 136.4550, elevation: 550, label: '名松新道登山口' }
  },
  {
    id: 'bc_hegoyama',
    name: '部子山',
    region: 'hokuriku', regionName: '北陸', prefecture: '福井県', areaName: '奥越・福井',
    slopeOrientation: 'N',
    top: { lat: 35.8862, lon: 136.4392, elevation: 1464, label: '部子山山頂' },
    base: { lat: 35.8781, lon: 136.4050, elevation: 720, label: '能楽の里牧場方面' }
  },
  {
    id: 'bc_dainichigatake',
    name: '大日ヶ岳 (奥美濃)',
    region: 'tokai', regionName: '東海', prefecture: '岐阜県', areaName: '奥美濃',
    slopeOrientation: 'E',
    top: { lat: 36.0014, lon: 136.8377, elevation: 1709, label: '大日ヶ岳山頂' },
    base: { lat: 35.9906, lon: 136.8556, elevation: 1550, label: '高鷲スノーパーク・ゴンドラ山頂' }
  },
  {
    id: 'bc_nobusegatake',
    name: '野伏ヶ岳',
    region: 'tokai', regionName: '東海', prefecture: '岐阜県', areaName: '奥美濃',
    slopeOrientation: 'S',
    top: { lat: 36.0128, lon: 136.7324, elevation: 1674, label: '野伏ヶ岳山頂' },
    base: { lat: 35.9958, lon: 136.7689, elevation: 860, label: '白山中居神社（石徹白）' }
  },
  {
    id: 'bc_sanpokuzureyama',
    name: '三方崩山',
    region: 'tokai', regionName: '東海', prefecture: '岐阜県', areaName: '飛騨・白川郷',
    slopeOrientation: 'W',
    top: { lat: 36.1789, lon: 136.8602, elevation: 2059, label: '三方崩山山頂' },
    base: { lat: 36.1783, lon: 136.8906, elevation: 750, label: '平瀬登山口' }
  },
  {
    id: 'bc_nodanishojiyama',
    name: '野谷荘司山',
    region: 'tokai', regionName: '東海', prefecture: '岐阜県', areaName: '飛騨・白川郷',
    slopeOrientation: 'E',
    top: { lat: 36.246, lon: 136.8477, elevation: 1797, label: '野谷荘司山山頂' },
    base: { lat: 36.2389, lon: 136.8767, elevation: 780, label: '馬狩・白川郷方面' }
  },
  {
    id: 'bc_kanakusoyama',
    name: '金糞岳',
    region: 'kansai', regionName: '関西', prefecture: '滋賀県', areaName: '伊吹・湖北',
    slopeOrientation: 'W',
    top: { lat: 35.5504, lon: 136.3369, elevation: 1317, label: '金糞岳山頂' },
    base: { lat: 35.5639, lon: 136.3017, elevation: 550, label: '鳥越峠方面' }
  },

  // ========================
  // 近畿・中国・四国・九州 (9座)
  // ========================
  {
    id: 'bc_ibukiyama',
    name: '伊吹山',
    region: 'kansai', regionName: '関西', prefecture: '滋賀県', areaName: '伊吹・湖北',
    slopeOrientation: 'S',
    top: { lat: 35.4178, lon: 136.4064, elevation: 1377, label: '伊吹山山頂' },
    base: { lat: 35.3989, lon: 136.3917, elevation: 220, label: '上野登山口' }
  },
  {
    id: 'bc_yokoyamadake',
    name: '横山岳',
    region: 'kansai', regionName: '関西', prefecture: '滋賀県', areaName: '伊吹・湖北',
    slopeOrientation: 'S',
    top: { lat: 35.6015, lon: 136.2617, elevation: 1132, label: '横山岳山頂' },
    base: { lat: 35.5889, lon: 136.2650, elevation: 320, label: '白谷本流登山口' }
  },
  {
    id: 'bc_akasakayama',
    name: '赤坂山',
    region: 'kansai', regionName: '関西', prefecture: '滋賀県', areaName: '比良・湖西',
    slopeOrientation: 'SE',
    top: { lat: 35.5236, lon: 136.0267, elevation: 824, label: '赤坂山山頂' },
    base: { lat: 35.5017, lon: 136.0389, elevation: 220, label: 'マキノ高原登山口' }
  },
  {
    id: 'bc_bunagatake',
    name: '武奈ヶ岳 (比良山)',
    region: 'kansai', regionName: '関西', prefecture: '滋賀県', areaName: '比良・湖西',
    slopeOrientation: 'W',
    top: { lat: 35.2645, lon: 135.8969, elevation: 1214, label: '武奈ヶ岳山頂' },
    base: { lat: 35.2606, lon: 135.8622, elevation: 340, label: '坊村登山口（葛川）' }
  },
  {
    id: 'bc_hyonosen',
    name: '氷ノ山',
    region: 'chugoku', regionName: '中国', prefecture: '兵庫県', areaName: '氷ノ山・但馬',
    slopeOrientation: 'N',
    top: { lat: 35.3542, lon: 134.5139, elevation: 1510, label: '氷ノ山山頂' },
    base: { lat: 35.3742, lon: 134.5250, elevation: 880, label: '氷ノ山国際スキー場上部' }
  },
  {
    id: 'bc_daisen',
    name: '大山 (伯耆大山)',
    region: 'chugoku', regionName: '中国', prefecture: '鳥取県', areaName: '大山・山陰',
    slopeOrientation: 'NW',
    top: { lat: 35.3711, lon: 133.5461, elevation: 1729, label: '伯耆大山（弥山・剣ヶ峰）' },
    base: { lat: 35.3883, lon: 133.5333, elevation: 780, label: '博労座・大山夏山登山口' }
  },
  {
    id: 'bc_ishizuchisan',
    name: '石鎚山',
    region: 'chugoku', regionName: '中国', prefecture: '愛媛県', areaName: '四国山地',
    slopeOrientation: 'N',
    top: { lat: 33.7675, lon: 133.1144, elevation: 1982, label: '石鎚山（弥山・天狗岳）' },
    base: { lat: 33.7989, lon: 133.1189, elevation: 1300, label: '石鎚登山ロープウェイ山頂成就駅' }
  },
  {
    id: 'bc_tsurugisan',
    name: '剣山',
    region: 'chugoku', regionName: '中国', prefecture: '徳島県', areaName: '四国山地',
    slopeOrientation: 'N',
    top: { lat: 33.8536, lon: 134.0944, elevation: 1955, label: '剣山山頂' },
    base: { lat: 33.8717, lon: 134.1011, elevation: 1420, label: '見ノ越登山口' }
  },
  {
    id: 'bc_kuju_kujusan',
    name: '九重連山 (久住山)',
    region: 'chugoku', regionName: '中国', prefecture: '大分県', areaName: '阿蘇・九重',
    slopeOrientation: 'N',
    top: { lat: 33.0819, lon: 131.2408, elevation: 1787, label: '久住山山頂' },
    base: { lat: 33.0956, lon: 131.2139, elevation: 1330, label: '牧ノ戸峠登山口' }
  }
];
