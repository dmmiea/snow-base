/**
 * POWDER BASE JAPAN - Unified i18n Module (data-i18n + t() Architecture)
 * 業界標準のキーベース多言語管理モジュール（TreeWalker不使用・キメラ化ゼロ）
 */
(function () {
  window.currentLang = localStorage.getItem('powderbase_lang') || 'ja';
  window.enNamesDict = window.enNamesDict || null;
  window.jaNamesDict = window.jaNamesDict || null;

  // 固有名詞辞書 (en_names.json) のロード
  function loadEnNamesDict() {
    if (window.enNamesDict || window._loadingEnNames) return;
    window._loadingEnNames = true;
    fetch('en_names.json')
      .then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (d) {
        window.enNamesDict = d || {};
        window.jaNamesDict = {};
        for (const [k, v] of Object.entries(window.enNamesDict)) {
          if (v && !window.jaNamesDict[v]) window.jaNamesDict[v] = k;
        }
        if (window.currentLang === 'en' && typeof window.refreshAllI18nViews === 'function') {
          window.refreshAllI18nViews();
        }
      })
      .catch(function () {
        window.enNamesDict = {};
      });
  }
  loadEnNamesDict();

  // ==========================================
  // 1. UI 辞書 (ja / en 完全対称キー)
  // ==========================================
  const TRANSLATIONS = {
    ja: {
      // Splash & Header
      splashLoading: '最新データを取得中...',
      headerHomeTitle: 'ホーム先頭へ戻る',
      headerNotifTitle: '雪予報プッシュ通知設定',
      searchBtn: '検索',
      loadingShort: '読込中...',
      loadingBanner: '最新の全国雪データを読み込み中...',
      loadErrorShort: '取得エラー',
      loadErrorBanner: '⚠️ データの読み込みに失敗しました',
      reloadBtn: '再読込',
      pullToRefresh: '引いて最新データに更新',
      releaseToRefresh: '指を離して更新',
      refreshingData: 'データ更新中...',
      refreshComplete: '更新完了！',

      // Category & Region Selector
      catSkiLabel: 'スキー場',
      catBcLabel: 'バックカントリー',
      catSkiShort: '🏂 スキー場',
      catBcShort: '⛰️ バックカントリー',
      catBcShortMount: '⛰️ BC山',
      catSkiBadge: '🏂ゲレンデ',
      catBcBadge: '⛰️BC',
      catBcMountBadge: '⛰️山',
      selectRegionLabel: '① 地方を選択',
      selectAreaLabel: '② エリアを選択',
      allAreasOption: '全エリア',
      regOptAll: '全国',
      regOptHokkaido: '北海道',
      regOptTohoku: '東北',
      regOptShinetsu: '信越 (長野・新潟)',
      regOptHokuriku: '北陸 (富山・石川・福井)',
      regOptKanto: '関東 (群馬・栃木他)',
      regOptTokai: '東海 (岐阜・奥美濃)',
      regOptKansai: '関西 (滋賀・兵庫・京都)',
      regOptChugoku: '中国・西日本 (鳥取・広島・四国他)',

      // Region short names
      regAll: '全国',
      regHokkaido: '北海道',
      regTohoku: '東北',
      regShinetsu: '信越',
      regHokuriku: '北陸',
      regKanto: '関東',
      regTokai: '東海',
      regKansai: '関西',
      regWest: '西日本',
      regChugokuShort: '中国',
      regShinetsuFull: '信越（長野・新潟）',
      regHokurikuFull: '北陸（富山・石川・福井）',
      regKantoFull: '関東・群馬・栃木',
      regTokaiFull: '東海・岐阜',
      regKansaiFull: '関西（滋賀・兵庫・京都）',
      regChugokuFull: '中国・四国・九州',
      mainAreaFallback: '主要エリア',
      otherAreaFallback: 'その他エリア',

      // Spot Pills & Hero Card
      mySpotsPill: 'MYスポット',
      emptyFavPillHint: '右上の★を押してMYスポットを登録してください',
      favBtnTitle: 'MYスポット登録',
      unfavBtnTitle: 'MYスポット解除',
      shareBtnTitle: 'このスポットをシェア',
      mapBtnTitle: 'Googleマップで場所・アクセスを確認',
      snowScoreLabel: '雪質スコア',
      mountainCondLabel: '山岳コンディション',
      scoreHelpTitle: '雪質スコアの解説',
      topLabel: 'トップ',
      baseLabel: 'ベース',
      defaultSummitPeak: '山頂ピーク',
      defaultResortTop: 'ゲレンデトップ',
      defaultTrailheadBase: '登山口・ベース',
      defaultResortBase: 'ゲレンデベース',
      elevDiffFormat: '↕ 標高差 {diff}m',
      overnightHeader: 'OVERNIGHT SNOW (18時〜翌06時)',
      heroNightToggleThis: '今朝',
      heroNightToggleNext: '明朝',
      heroNightHeaderThis: '今朝の実績 ({date})',
      heroNightHeaderNext: '明朝の予報 ({date})',
      overnightThisMorningWithDate: '今朝({date})',
      overnightNextMorningWithDate: '明朝({date})',
      thisMorningNightSnowDate: '今朝 新雪 ({date})',
      nextMorningNightSnowDate: '明朝 新雪 ({date})',
      overnightHelpTitle: '夜間新雪の解説',
      topFreshSnow: 'トップ新雪',
      bcWeatherGuide: '山岳気象目安',
      bcFactorPrefix: '【要因】{reasons} — ',
      bcSafetyNotice: '雪崩情報・装備を確認の上、自己責任で行動してください。',
      curWeatherLabel: '現在天気',
      tempTopBaseLabel: '気温 (トップ/ベース)',
      topWindLabel: 'トップ風速',
      ridgeWindLabel: '稜線・山頂風',
      amedasLiveDefault: 'アメダス実測',
      amedasStationFormat: '{station}実測',
      roadStationFormat: '{station}道路雪量計',
      riverStationFormat: '{station}テレメータ',
      amedasNoData: '実測無し',

      // Slope Aspects
      aspectN: '🧭 北斜面',
      aspectNE: '🧭 北東斜面',
      aspectE: '🧭 東斜面',
      aspectSE: '🧭 南東斜面',
      aspectS: '🧭 南斜面',
      aspectSW: '🧭 南西斜面',
      aspectW: '🧭 西斜面',
      aspectNW: '🧭 北西斜面',
      aspectALL: '🧭 全方位',
      aspectCustom: '🧭 {dir}斜面',

      // Home Report Summary Card
      reportCountFormat: '{n}件',
      ratingPrefix: '評価:',
      ratingNone: '未報告',
      snowPrefix: '雪質:',

      // Trend Chart
      trendTitle: 'SNOW TREND（過去24h・7日予報）',
      trendHelpTitle: 'トレンドグラフの解説',
      trend7dBtn: '7日間',
      trendBcDepthBtn: '積雪深',
      trendBcTempBtn: '気温(0℃線)',
      naturalSnowEstBadge: '自然雪推定',
      legendSnowDepth: '積雪深(cm)',
      legendTopTemp: '山頂気温(℃)',
      legendZeroLine: '0℃基準線',
      next24hSnowLabel: '今後24h降雪',
      liveDelta24hLabel: '実測24h増減',
      windLiftAlert: '⚠️運休注意',
      legendSnowfall: '降雪量(cm/h)',
      legendRainfall: '降雨量(mm/h)',
      legendNow: '現在時刻',
      chartTooltipTempWind: '気温: {temp} / 風: {wind}',

      // Weekly Forecast
      weeklyTitle: 'WEEKLY FORECAST（7日間）',
      weeklyTapHint: '※タップで該当日の詳細へ',
      weeklyLegendDaily: '<strong class="text-slate-900">❄️</strong> 1日合計 (0-24時)',
      weeklyLegendNight: '<strong class="text-orange-700">夜間</strong> オーバーナイト (18-06時)',
      todayLabel: '今日',
      tomorrowLabel: '明日',
      nightShort: '夜間',
      dailyShort: '1日',

      // Timeline
      timelineTitle: 'TIMELINE（1時間刻み）',
      timelineHelpTitle: 'タイムラインの解説',
      tlColTime: '時刻',
      tlColWeather: '天気',
      tlColTempWindTop: '気温・風(トップ)',
      tlColTempWindBase: '気温・風(ベース)',
      tlColBasePrecip: 'ベース 雪/雨',
      tlColTopPrecip: 'トップ 雪/雨',
      tlFooterNote: '※雪/雨: 降雪(cm/h)・降雨(mm/h) / 下段=積雪深(cm)',
      tlNightSumLabel: '🌙 夜間新雪合計 (18-06時)',
      tlDaySumLabel: '☀️ 日中降雪合計 (06-18時)',
      dateFormatMD: '{m}月{d}日',

      // Weather & Wind Legend Card
      weatherLegendTitle: '天気マーク・風の見方（凡例）',
      weatherLegendSub: '1時間降雪・風速連動',
      weatherIconsHeading: '天気マーク',
      wIconClear: '快晴',
      wIconPartly: '晴れ/薄曇',
      wIconCloudy: '曇り',
      wIconFog: '霧/濃霧',
      wIconLightSnow: '小雪(<0.5cm)',
      wIconSnow: '雪(0.5cm~)',
      wIconHeavySnow: '大雪(3cm~)',
      wIconBlizzard: '吹雪(12m~)',
      wIconDrizzle: '霧雨/にわか雨',
      wIconRainSleet: '雨/みぞれ',
      wIconThunder: '雷雨/荒天',
      windLegendHeading: '風速カラー基準 & 風向き矢印',
      windCalm: '弱風・快適',
      windMod: 'やや強風',
      windStrong: '強風・減速注意',
      windGale: '暴風・運休警戒',
      windLegendNoteHtml: '※風向きは<strong class="text-slate-800">「吹いてくる方角（N/NE等）」と「風が流れていく矢印」</strong>を表示しています（例：<span class="font-bold text-slate-800">↘ NW</span>＝北西から南東へ吹く風）。',

      // Guide & Share Cards on Home
      firstTimeLabel: '初めての方へ',
      userGuideLabel: '使い方ガイド',
      shareFriendsLabel: '雪山仲間に',
      shareAppLabel: '教える・シェア',
      allSpotsAccordionTitle: '全国8地方・スキー場＆BC一覧（全547地点）',
      viewListBadge: '一覧を見る',
      loadingText: '読み込み中...',
      spotsCountUnit: '{n}地点',

      // Areas & Ranking Tab
      tabByArea: 'エリア別一覧',
      tabPowderRanking: 'パウダーランキング',
      areasSearchPlaceholder: 'エリア名・スキー場・山名で絞り込み...',
      condAll: 'すべて',
      condFresh: '❄️ 新雪あり',
      condOpen: '⛷️ 滑走可能(30cm~)',
      expandAll: 'すべて展開',
      collapseAll: 'すべて閉じる',
      loadingAreasData: 'データを読み込み中です...',
      noMatchingAreas: '条件に一致するエリアがありません',
      areaMaxDepth: '最大積雪',
      areaBest: '最高',
      spotDepthPrefix: '積雪',
      spotScorePrefix: 'スコア',
      overnightSnowLabel: '夜間新雪',
      rankNightBtn: '🌙 オーバーナイト',
      rank6hBtn: '⚡ 6時間速報',
      rank24hBtn: '❄️ 24時間累積',
      rankCalculating: '現在ランキングデータを集計中です',
      rankNoData: '該当カテゴリのデータがありません',
      rankSnowfallLabel: '降雪量',
      rank6hLabel: '⚡6h降雪',
      rank24hLabel: '❄️24h降雪',
      rankResetBadge: 'リセット❄️',
      rankDepthFormat: '積雪: {depth}cm',
      rankSourceLive: '📡 実測',
      rankSourceForecast: '🔮 予報',
      rankLiveNightBtn: '🌙 オーバーナイト',
      rankLive6hBtn: '6時間',
      rankLive12hBtn: '12時間',
      rankLive24hBtn: '24時間',
      rankLiveNightLabel: '🌙夜間実測',
      rankLive6hLabel: '6h実測',
      rankLive12hLabel: '12h実測',
      rankLive24hLabel: '24h実測',
      rankLiveDepthLabel: '積雪',
      rankLiveSubsidenceLabel: '沈降',
      rankLiveFreshnessLabel: '最終降雪',
      rankLiveFreshSnowing: '降雪中',
      rankLiveFreshHours: '{h}h前',
      rankLiveTempLabel: '気温',
      rankLiveStationAmedas: 'アメダス',
      rankLiveStationRoad: '道路雪量計',
      rankLiveStationRiver: 'テレメータ',
      rankLiveMoreSpots: '＋他{count}件',
      rankLiveCollapseSpots: '閉じる',
      rankLiveLegend: '沈降: 圧密・融解による減少量 / 最終降雪: 0h=直近1hに降雪',
      rankPeriodPrefix: '対象:',
      rankStatusConfirmed: '確定',
      rankStatusLive: '速報・途中経過',
      rankBannerHours: '{start} 〜 {end}（過去{h}時間）',
      rankBannerForecastNight: '{date} 06:00（前夜18:00〜の予報）',
      rankBannerForecastHours: '{start} 〜 {end}（今後{h}時間の予報）',
      rankLiveNightDateLabel: '🌙 {date}夜間実測',
      snowNow: '降雪中',
      hoursAgo: '{h}h前',
      heroLiveBarTitle: '公的積雪実測フル検証',
      heroLiveNightShort: '夜間',
      heroLive6hShort: '6h',
      heroLive24hShort: '24h',
      heroLiveNoChange: '増減なし',
      legendOpenHint: '開く',

      // Phase 3: THE DAY & BC Zero Degree & Slope Hazard
      theDayBadge: '🌟 THE DAY',
      theDayWeekLabel: '今週のTHE DAY',
      theDayCardNotice: '今週のベスト狙い目',
      zeroDegreeLabel: '0℃標高',
      zeroDegreeSubZeroAll: '全標高0℃以下 (氷点下維持)',
      zeroDegreeAboveSummit: '山頂以上 (融解・雨注意)',
      zeroDegreeMeters: '約{elev}m',
      windSlabWarning: '風下スラブ警戒',
      windSlabSlopeDesc: '{aspect}斜面に吹き溜まり形成の危険',
      ridgeWindShort: '稜線',
      liveAmedasShort: '実測',
      tlZeroDegreeNotice: '0℃境界',
      themeToggleTitle: 'テーマ切替 (ライト/ダーク)',

      // Feed Tab
      feedHeaderTitle: '全国最新雪レポフィード',
      feedFilterAll: 'すべて',
      feedFilterReports: '💬 雪レポのみ',
      feedFilterFavs: '⭐ MYスポット',
      feedPostBtn: '＋ 雪レポ',
      feedEmptyFilter: '該当するレポートはありません',
      feedEmptyFavTitle: 'MYスポットを登録して最新速報を受け取る',
      feedEmptyFavDesc: 'よく行くスキー場や山を★お気に入り登録すると、ここに今後3日間の降雪・夜間新雪速報が定時配信（6:00 / 19:30）されます。',
      feedEmptyFavBtn: 'スポットを探して登録する',
      feedAiTopBanner: '全国トップ速報',
      feedUpcomingPeak: '直近ピーク: {day} 夜間+{snow}cm',
      feedLiveLineLabel: '公的実測',
      nextMorningNightSnow: '明朝 夜間新雪 (18-06時)',
      thisMorningNightSnow: '今朝 夜間新雪 (18-06時)',
      depthTopBaseFormat: '積雪 {top}/{base}cm',
      tempWindFormat: '{icon} {temp}℃ / 風{wind}m/s',
      forecast3DayTitle: '今後3日間の降雪予報',
      forecast3DaySub: '夜間新雪 / 1日計',
      savedSpotLiveUpdate: '登録スポット最新速報',
      viewForecastLink: '詳細予報を見る',
      reportBadge: '雪レポ',
      userFieldReport: 'みんなの現地レポート',
      viewDetailsLink: '詳細を見る',
      todayTimeDefault: '本日',
      justNow: 'たった今',
      minAgoFormat: '{n}分前',
      hourAgoFormat: '{n}時間前',
      dayAgoFormat: '{n}日前',
      nightPlusFormat: '夜間+{n}cm',
      nightPlusZero: '夜間+0cm',

      // Saved (My Spots) Tab
      mySpotsTitle: 'MYスポット一覧',
      mySpotsDesc: '登録スポットの夜間新雪・積雪・雪質を一目で比較',
      sortFavDefault: '登録順',
      sortFavNightSnow: '🌙 新雪順',
      sortFavScore: '🏆 スコア順',
      addBtn: '追加',
      mySpotsEmptyTitle: 'MYスポットがまだ登録されていません',
      mySpotsEmptyDesc: 'ホーム画面のスポット名横にある「★」マークをタップするか、上の追加ボタンからよく行くゲレンデ・BC山を登録すると、ここで一括比較できます。',
      mySpotsEmptyBtn: '全国スポットから検索して追加',
      toastFavRemoved: '⭐ MYスポットから解除しました',
      toastFavAdded: '⭐ MYスポットに追加しました',

      // Bottom Navigation
      navHome: 'ホーム',
      navAreas: 'エリア一覧',
      navFeed: 'フィード',
      navMap: 'マップ',
      navMySpots: 'MYスポット',

      // Notification Modal
      notifModalTitle: 'パウダー・降雪プッシュ通知設定',
      notifModalSub: '設定した新雪量以上が降る時＆週末雪予想だけ自動通知',
      iosGuideTitle: 'iPhoneで通知を受け取る手順',
      iosGuideDescHtml: 'iOS Safariの仕様上、プッシュ通知を受信するには本アプリを<strong>「ホーム画面に追加」</strong>して起動する必要があります。',
      iosStep1Html: '画面下部中央の <strong>共有ボタン</strong> <i class="fa-solid fa-arrow-up-from-bracket mx-0.5 text-sky-700"></i> をタップ',
      iosStep2Html: 'メニュー内の <strong>「ホーム画面に追加」</strong> <i class="fa-regular fa-square-plus mx-0.5 text-slate-700"></i> をタップ',
      iosStep3Html: 'ホーム画面の <strong>POWDER BASE アイコン</strong> から起動し、ここで通知をONにする',
      notifStatusLabel: '通知ステータス',
      notifChecking: '確認中...',
      notifEnableBtn: '通知を有効にする',
      notifDisableBtn: '通知をOFFにする',
      notifBlockedBtn: 'ブロック中',
      notifUnsupported: 'このブラウザはプッシュ通知に非対応です',
      notifBlockedHtml: '<span class="text-rose-700 font-bold">通知がブロックされています（端末設定から許可してください）</span>',
      notifActiveHtml: '<span class="text-emerald-700 font-bold">ON（プッシュ通知受信中）</span>',
      notifInactiveHtml: '<span class="text-slate-700">OFF（未登録）</span>',
      notifConnectedText: '通知が接続されています',
      notifTestBtn: 'テスト通知を試す',
      notifThresholdHeading: '通知する新雪の基準（この量以上降る時だけ通知）',
      notifRulesHeading: '受信ルール（すべて基準以上の降雪時のみ配信）',
      notifRuleMorningTitle: '🌙 朝のパウダー速報（06:00台）',
      notifRuleMorningDesc: '今朝の夜間新雪が基準以上積もった朝だけ通知',
      notifRuleEveningTitle: '🌨️ 夜の予報アラート（19:00台）',
      notifRuleEveningDesc: '明朝の新雪、または3日以内に基準以上降る予報時だけ通知',
      notifRuleWeekendTitle: '📅 週末パウダー予想（木・金 19:00台）',
      notifRuleWeekendDesc: '土日のいずれかで基準以上の降雪予報がある週末だけ通知',
      notifRuleAiTitle: '🤖 AI全国パウダー大賞',
      notifRuleAiDesc: 'MYスポット以外でも全国トップ級（+20cm以上）出現時にお知らせ',
      notifSpotsHeading: '通知を受け取るスポット',
      notifSpotsCountFormat: '{n}箇所',
      notifSelectAllFav: 'MY全選択',
      notifFilterFav: '⭐ MYスポット',
      notifFilterSelected: '選択中のみ',
      notifEmptyFav: 'MYスポットが未登録です。上の地方タブから直接選ぶこともできます。',
      notifEmptyRegion: '該当するスポットがありません',
      notifSavedAlert: '通知設定を保存しました',
      toastPushUnsupported: 'この環境ではプッシュ通知を利用できません',
      toastPushDisabled: 'プッシュ通知をOFFにしました',
      toastPushDenied: '通知が許可されませんでした',
      toastPushEnabled: '❄️ プッシュ通知を有効にしました！',
      toastPushError: '通知設定の切り替えに失敗しました',
      testNotifTitle: '❄️ POWDER BASE テスト通知',
      testNotifBody: '通知は正常に接続されています！（設定基準: +{threshold}cm以上の降雪・週末予想でお知らせ）',
      toastTestNotifError: 'テスト通知の送信に失敗しました',

      // Guide / Help Modal
      guideDefaultTitle: '使い方の解説',
      guideDefaultSub: '見方とチェックポイント',
      closeBtn: '閉じる',

      // Share Modal
      shareModalTitle: '雪山情報をシェア',
      shareModalSub: '仲間にコンディションを教える',
      shareNativeBtn: 'スマホの共有メニューで送る',
      shareLineBtn: 'LINEで送る',
      shareXBtn: 'X（旧Twitter）でポスト',
      shareCopyUrlBtn: 'URLリンクをコピー',
      copyShortBtn: 'コピー',
      shareSpotTitleFormat: '【{name}】積雪・雪質速報',
      shareSpotSubFormat: '雪質スコア: {score}{pt} ({tag})',
      toastUrlCopied: '📋 URLをクリップボードにコピーしました！',
      toastShareCopied: '📋 共有テキストとURLをコピーしました！',

      // Search Modal
      searchModalPlaceholder: 'スキー場名、山名、エリアで検索...',

      // Report Modal
      reportModalTitle: '雪レポート登録',
      reportModalSub: '現地のリアルな雪質・コンディションを共有',
      reportSpotField: '滑走スポット',
      reportTimeSlotField: '滑走時間帯',
      slotFirstChair: '朝イチ',
      slotMorning: '午前',
      slotAfternoon: '午後',
      slotNight: 'ナイター',
      reportRatingField: '体感満足度',
      scorePtUnit: '点',
      scorePtsFormat: '{n}点',
      reportSnowTypeField: '雪質・バーン状況',
      optEpicPow: '神パウ',
      optDeepPow: '極上パウ',
      optGoodPow: '良質パウ',
      optLightPow: 'ちょいパウ',
      optHeavyPow: '重パウ',
      optPacked: 'しまり雪',
      optCorn: 'ザラメ雪',
      optIce: 'アイスバーン',
      optRainMelt: '雨・融雪',
      reportSnowDepthField: '新雪の深さ',
      optDepthNone: '新雪なし',
      optDepthAnkle: 'くるぶし 5〜15cm',
      optDepthShin: 'すね 15〜30cm',
      optDepthKnee: 'ひざ 30〜50cm',
      optDepthThigh: 'もも 50〜70cm',
      optDepthWaist: '腰 70〜100cm',
      optDepthChest: '胸以上 100cm+',
      reportCommentField: '現地のひとことメモ（任意）',
      reportCommentPlaceholder: '例: 朝イチの非圧雪コースが軽く、視界も良好でした',
      submitReportBtn: '雪レポを登録する',
      submittingBtn: '送信中...',
      reportFooterNote: '※全国のスキーヤー・スノーボーダーと即座にリアルタイム共有されます',
      reportSuccessAlert: '【雪レポ登録完了】\n{spot}\n{slot} / {snow}\n\nレポートありがとうございます！全国のスキーヤー・スノーボーダーとリアルタイム共有されました。',
      reportOfflineAlert: '雪レポを登録しました！（オフライン保持）',
      reportCooldownAlert: '【連続投稿の制限】\nいたずら・重複投稿防止のため、同じスポットへの再投稿は30分間制限されています。\nあと約{mins}分後に再投稿が可能になります。'
    },

    en: {
      // Splash & Header
      splashLoading: 'Loading live snow data...',
      headerHomeTitle: 'Back to Home Top',
      headerNotifTitle: 'Snow Forecast Push Alerts',
      searchBtn: 'Find',
      loadingShort: 'Loading...',
      loadingBanner: 'Loading latest Japan snow data...',
      loadErrorShort: 'Error',
      loadErrorBanner: '⚠️ Failed to load snow data',
      reloadBtn: 'Reload',
      pullToRefresh: 'Pull to refresh',
      releaseToRefresh: 'Release to refresh',
      refreshingData: 'Refreshing data...',
      refreshComplete: 'Updated!',

      // Category & Region Selector
      catSkiLabel: 'Ski Resorts',
      catBcLabel: 'Backcountry',
      catSkiShort: '🏂 Ski Resort',
      catBcShort: '⛰️ Backcountry',
      catBcShortMount: '⛰️ Backcountry',
      catSkiBadge: '🏂Resort',
      catBcBadge: '⛰️BC',
      catBcMountBadge: '⛰️BC',
      selectRegionLabel: '1. Region',
      selectAreaLabel: '2. Area',
      allAreasOption: 'All Areas',
      regOptAll: 'All Japan',
      regOptHokkaido: 'Hokkaido',
      regOptTohoku: 'Tohoku',
      regOptShinetsu: 'Shinetsu (Nagano/Niigata)',
      regOptHokuriku: 'Hokuriku',
      regOptKanto: 'Kanto (Gunma/Tochigi)',
      regOptTokai: 'Tokai (Gifu)',
      regOptKansai: 'Kansai',
      regOptChugoku: 'West Japan',

      // Region short names
      regAll: 'All',
      regHokkaido: 'Hokkaido',
      regTohoku: 'Tohoku',
      regShinetsu: 'Shinetsu',
      regHokuriku: 'Hokuriku',
      regKanto: 'Kanto',
      regTokai: 'Tokai',
      regKansai: 'Kansai',
      regWest: 'West',
      regChugokuShort: 'West',
      regShinetsuFull: 'Shinetsu (Nagano / Niigata)',
      regHokurikuFull: 'Hokuriku (Toyama / Ishikawa / Fukui)',
      regKantoFull: 'Kanto / Gunma / Tochigi',
      regTokaiFull: 'Tokai / Gifu',
      regKansaiFull: 'Kansai (Shiga / Hyogo / Kyoto)',
      regChugokuFull: 'Chugoku / Shikoku / Kyushu',
      mainAreaFallback: 'Main Area',
      otherAreaFallback: 'Other Area',

      // Spot Pills & Hero Card
      mySpotsPill: 'Saved',
      emptyFavPillHint: 'Tap ★ at top right to save your favorite spots',
      favBtnTitle: 'Save Spot',
      unfavBtnTitle: 'Remove from Saved',
      shareBtnTitle: 'Share this spot',
      mapBtnTitle: 'View location & access on Google Maps',
      snowScoreLabel: 'Snow Score',
      mountainCondLabel: 'Mountain Condition',
      scoreHelpTitle: 'About Snow Score',
      topLabel: 'Top',
      baseLabel: 'Base',
      defaultSummitPeak: 'Summit Peak',
      defaultResortTop: 'Top',
      defaultTrailheadBase: 'Trailhead / Base',
      defaultResortBase: 'Base',
      elevDiffFormat: '↕ Vert {diff}m',
      overnightHeader: 'OVERNIGHT (18-06h)',
      heroNightToggleThis: 'This AM',
      heroNightToggleNext: 'Next AM',
      heroNightHeaderThis: 'This AM ({date})',
      heroNightHeaderNext: 'Next AM ({date})',
      overnightThisMorningWithDate: 'This AM({date})',
      overnightNextMorningWithDate: 'Next AM({date})',
      thisMorningNightSnowDate: 'This AM Snow ({date})',
      nextMorningNightSnowDate: 'Next AM Snow ({date})',
      overnightHelpTitle: 'About Overnight Snow',
      topFreshSnow: 'Top Fresh Snow',
      bcWeatherGuide: 'Mountain Weather Guide',
      bcFactorPrefix: '[Factor] {reasons} — ',
      bcSafetyNotice: 'Check avalanche info & gear before entering backcountry.',
      curWeatherLabel: 'Current Weather',
      tempTopBaseLabel: 'Temp (Top/Base)',
      topWindLabel: 'Top Wind',
      ridgeWindLabel: 'Ridge / Summit Wind',
      amedasLiveDefault: 'AMeDAS Live',
      amedasStationFormat: '{station} AMeDAS',
      roadStationFormat: '{station} Road Gauge',
      riverStationFormat: '{station} Telemeter',
      amedasNoData: 'No Live Data',

      // Slope Aspects
      aspectN: '🧭 N Aspect',
      aspectNE: '🧭 NE Aspect',
      aspectE: '🧭 E Aspect',
      aspectSE: '🧭 SE Aspect',
      aspectS: '🧭 S Aspect',
      aspectSW: '🧭 SW Aspect',
      aspectW: '🧭 W Aspect',
      aspectNW: '🧭 NW Aspect',
      aspectALL: '🧭 All Aspects',
      aspectCustom: '🧭 {dir} Aspect',

      // Home Report Summary Card
      reportCountFormat: '({n})',
      ratingPrefix: 'Rating:',
      ratingNone: 'None',
      snowPrefix: 'Snow:',

      // Trend Chart
      trendTitle: 'SNOW TREND (Past 24h & 7-Day)',
      trendHelpTitle: 'About Snow Trend Chart',
      trend7dBtn: '7 Days',
      trendBcDepthBtn: 'Snow Depth',
      trendBcTempBtn: 'Temp (0°C Line)',
      naturalSnowEstBadge: 'Est. Natural',
      legendSnowDepth: 'Snow Depth (cm)',
      legendTopTemp: 'Top Temp (°C)',
      legendZeroLine: '0°C Line',
      next24hSnowLabel: 'Next 24h Snow',
      liveDelta24hLabel: '24h Live Delta',
      windLiftAlert: '⚠️Lift Hold Risk',
      legendSnowfall: 'Snowfall (cm/h)',
      legendRainfall: 'Rainfall (mm/h)',
      legendNow: 'Now',
      chartTooltipTempWind: 'Temp: {temp} / Wind: {wind}',

      // Weekly Forecast
      weeklyTitle: 'WEEKLY FORECAST (7 Days)',
      weeklyTapHint: 'Tap day for details',
      weeklyLegendDaily: '<strong class="text-slate-900">❄️</strong> Daily Total (0-24h)',
      weeklyLegendNight: '<strong class="text-orange-700">Night</strong> Overnight (18-06h)',
      todayLabel: 'Today',
      tomorrowLabel: 'Tomorrow',
      nightShort: 'Night',
      dailyShort: 'Daily',

      // Timeline
      timelineTitle: 'TIMELINE (Hourly)',
      timelineHelpTitle: 'About Hourly Timeline',
      tlColTime: 'Time',
      tlColWeather: 'Wx',
      tlColTempWindTop: 'Temp / Wind (Top)',
      tlColTempWindBase: 'Temp / Wind (Base)',
      tlColBasePrecip: 'Base Snow/Rain',
      tlColTopPrecip: 'Top Snow/Rain',
      tlFooterNote: '* Snow/Rain: Snowfall(cm/h) / Rain(mm/h) • Bottom = Depth(cm)',
      tlNightSumLabel: '🌙 Overnight Total (18-06h)',
      tlDaySumLabel: '☀️ Daytime Total (06-18h)',
      dateFormatMD: '{m}/{d}',

      // Weather & Wind Legend Card
      weatherLegendTitle: 'Weather & Wind Legend',
      weatherLegendSub: 'Hourly Snow & Wind',
      weatherIconsHeading: 'Weather Icons',
      wIconClear: 'Clear',
      wIconPartly: 'Partly Cloudy',
      wIconCloudy: 'Cloudy',
      wIconFog: 'Fog',
      wIconLightSnow: 'Light (<0.5cm)',
      wIconSnow: 'Snow (0.5cm+)',
      wIconHeavySnow: 'Heavy (3cm+)',
      wIconBlizzard: 'Blizzard (12m+)',
      wIconDrizzle: 'Drizzle / Shower',
      wIconRainSleet: 'Rain / Sleet',
      wIconThunder: 'Thunder / Storm',
      windLegendHeading: 'Wind Speed Colors & Direction',
      windCalm: 'Light / Calm',
      windMod: 'Moderate',
      windStrong: 'Strong / Caution',
      windGale: 'Gale / Lift Hold',
      windLegendNoteHtml: '* Direction indicates where wind blows FROM (N/NE etc.) & arrow shows wind flow (e.g. <span class="font-bold text-slate-800">↘ NW</span> = wind blowing from NW to SE).',

      // Guide & Share Cards on Home
      firstTimeLabel: 'First Time?',
      userGuideLabel: 'User Guide',
      shareFriendsLabel: 'Share with Friends',
      shareAppLabel: 'Share App',
      allSpotsAccordionTitle: 'All 8 Regions: Resorts & BC (547)',
      viewListBadge: 'View List',
      loadingText: 'Loading...',
      spotsCountUnit: '{n} Spots',

      // Areas & Ranking Tab
      tabByArea: 'By Area',
      tabPowderRanking: 'Powder Ranking',
      areasSearchPlaceholder: 'Filter by area, resort, mountain...',
      condAll: 'All',
      condFresh: '❄️ Fresh Snow',
      condOpen: '⛷️ Open (30cm+)',
      expandAll: 'Expand All',
      collapseAll: 'Collapse All',
      loadingAreasData: 'Loading data...',
      noMatchingAreas: 'No matching areas found',
      areaMaxDepth: 'Max Depth',
      areaBest: 'Best',
      spotDepthPrefix: 'Depth',
      spotScorePrefix: 'Score',
      overnightSnowLabel: 'Overnight Snow',
      rankNightBtn: '🌙 Overnight',
      rank6hBtn: '⚡ 6h Alert',
      rank24hBtn: '❄️ 24h Total',
      rankCalculating: 'Calculating ranking data...',
      rankNoData: 'No data for this category',
      rankSnowfallLabel: 'Snowfall',
      rank6hLabel: '⚡6h Snow',
      rank24hLabel: '❄️24h Snow',
      rankResetBadge: 'Reset❄️',
      rankDepthFormat: 'Depth: {depth}cm',
      rankSourceLive: '📡 Live',
      rankSourceForecast: '🔮 Forecast',
      rankLiveNightBtn: '🌙 Overnight',
      rankLive6hBtn: '6h',
      rankLive12hBtn: '12h',
      rankLive24hBtn: '24h',
      rankLiveNightLabel: '🌙Overnight',
      rankLive6hLabel: '6h Live',
      rankLive12hLabel: '12h Live',
      rankLive24hLabel: '24h Live',
      rankLiveDepthLabel: 'Depth',
      rankLiveSubsidenceLabel: 'Settling',
      rankLiveFreshnessLabel: 'Last Snow',
      rankLiveFreshSnowing: 'Snowing',
      rankLiveFreshHours: '{h}h ago',
      rankLiveTempLabel: 'Temp',
      rankLiveStationAmedas: 'AMeDAS',
      rankLiveStationRoad: 'Road Gauge',
      rankLiveStationRiver: 'Telemeter',
      rankLiveMoreSpots: '+{count} more',
      rankLiveCollapseSpots: 'Close',
      rankLiveLegend: 'Settling: Compaction/melt loss / Last Snow: 0h = within 1h',
      rankPeriodPrefix: 'Window:',
      rankStatusConfirmed: 'Final',
      rankStatusLive: 'In Progress',
      rankBannerHours: '{start} – {end} (Past {h}h)',
      rankBannerForecastNight: '{date} 06:00 (18:00–06:00 Forecast)',
      rankBannerForecastHours: '{start} – {end} (Next {h}h Forecast)',
      rankLiveNightDateLabel: '🌙 {date} Overnight',
      snowNow: 'Snowing',
      hoursAgo: '{h}h ago',
      heroLiveBarTitle: 'Official Live Observation',
      heroLiveNightShort: 'Night',
      heroLive6hShort: '6h',
      heroLive24hShort: '24h',
      heroLiveNoChange: 'No change',
      legendOpenHint: 'Show',

      // Phase 3: THE DAY & BC Zero Degree & Slope Hazard
      theDayBadge: '🌟 THE DAY',
      theDayWeekLabel: 'Best Day This Week',
      theDayCardNotice: 'Best Powder Day',
      zeroDegreeLabel: 'Freezing Level',
      zeroDegreeSubZeroAll: 'Sub-zero at all elevs',
      zeroDegreeAboveSummit: 'Above summit (Melt/Rain hazard)',
      zeroDegreeMeters: '~{elev}m',
      windSlabWarning: 'Leeward Slab Hazard',
      windSlabSlopeDesc: 'Wind slab formation on {aspect} slopes',
      ridgeWindShort: 'Ridge',
      liveAmedasShort: 'Live',
      tlZeroDegreeNotice: '0℃ Line',
      themeToggleTitle: 'Toggle Theme (Light/Dark)',

      // Feed Tab
      feedHeaderTitle: 'Japan Snow Reports Feed',
      feedFilterAll: 'All',
      feedFilterReports: '💬 Reports Only',
      feedFilterFavs: '⭐ MY Spots',
      feedPostBtn: '+ Report',
      feedEmptyFilter: 'No matching reports found.',
      feedEmptyFavTitle: 'Save spots to receive live snow updates',
      feedEmptyFavDesc: 'Tap ★ on your favorite ski resorts or mountains to get 3-day snowfall & overnight powder updates here.',
      feedEmptyFavBtn: 'Find & Save Spots',
      feedAiTopBanner: 'Japan Top Alert',
      feedUpcomingPeak: 'Peak: {day} Overnight +{snow}cm',
      feedLiveLineLabel: 'Live Obs',
      nextMorningNightSnow: 'Tomorrow AM Overnight (18-06)',
      thisMorningNightSnow: 'This AM Overnight (18-06)',
      depthTopBaseFormat: 'Depth {top}/{base}cm',
      tempWindFormat: '{icon} {temp}℃ / Wind {wind}m/s',
      forecast3DayTitle: '3-Day Snow Forecast',
      forecast3DaySub: 'Overnight / Daily',
      savedSpotLiveUpdate: 'Saved Spot Live Update',
      viewForecastLink: 'View Forecast',
      reportBadge: 'Report',
      userFieldReport: 'User Field Report',
      viewDetailsLink: 'View Details',
      todayTimeDefault: 'Today',
      justNow: 'Just now',
      minAgoFormat: '{n}m ago',
      hourAgoFormat: '{n}h ago',
      dayAgoFormat: '{n}d ago',
      nightPlusFormat: 'Night +{n}cm',
      nightPlusZero: 'Night +0cm',

      // Saved (My Spots) Tab
      mySpotsTitle: 'Saved Spots',
      mySpotsDesc: 'Compare live overnight snow & depth',
      sortFavDefault: 'Saved',
      sortFavNightSnow: '🌙 Powder',
      sortFavScore: '🏆 Score',
      addBtn: 'Add',
      mySpotsEmptyTitle: 'No Saved Spots yet',
      mySpotsEmptyDesc: 'Tap the ★ icon next to a spot on Home or use the Add button above to compare your favorite resorts & BC mountains here.',
      mySpotsEmptyBtn: 'Search & Add Spots',
      toastFavRemoved: '⭐ Removed from Saved Spots',
      toastFavAdded: '⭐ Added to Saved Spots',

      // Bottom Navigation
      navHome: 'Home',
      navAreas: 'Areas',
      navFeed: 'Reports',
      navMap: 'Map',
      navMySpots: 'Saved',

      // Notification Modal
      notifModalTitle: 'Powder & Snowfall Push Alerts',
      notifModalSub: 'Auto-alert when fresh snow exceeds threshold & on snowy weekends',
      iosGuideTitle: 'How to enable notifications on iPhone',
      iosGuideDescHtml: 'Due to iOS Safari limits, please <strong>"Add to Home Screen"</strong> and launch the app from your Home Screen.',
      iosStep1Html: 'Tap the <strong>Share button</strong> <i class="fa-solid fa-arrow-up-from-bracket mx-0.5 text-sky-700"></i> at the bottom',
      iosStep2Html: 'Select <strong>"Add to Home Screen"</strong> <i class="fa-regular fa-square-plus mx-0.5 text-slate-700"></i> from the menu',
      iosStep3Html: 'Launch <strong>POWDER BASE</strong> from Home Screen and turn ON notifications here',
      notifStatusLabel: 'Notification Status',
      notifChecking: 'Checking...',
      notifEnableBtn: 'Enable Notifications',
      notifDisableBtn: 'Disable Notifications',
      notifBlockedBtn: 'Blocked',
      notifUnsupported: 'Push notifications not supported in this browser',
      notifBlockedHtml: '<span class="text-rose-700 font-bold">Notifications blocked (Please enable in device settings)</span>',
      notifActiveHtml: '<span class="text-emerald-700 font-bold">ON (Push notifications active)</span>',
      notifInactiveHtml: '<span class="text-slate-700">OFF (Not Registered)</span>',
      notifConnectedText: 'Notifications connected',
      notifTestBtn: 'Send Test Notification',
      notifThresholdHeading: 'Snowfall Alert Threshold',
      notifRulesHeading: 'Delivery Rules (Only when snowfall exceeds threshold)',
      notifRuleMorningTitle: '🌙 Morning Powder Alert (~06:00)',
      notifRuleMorningDesc: 'Notify only when fresh snow exceeds threshold this AM',
      notifRuleEveningTitle: '🌨️ Evening Forecast Alert (~19:00)',
      notifRuleEveningDesc: 'Notify only if fresh snow is expected tomorrow AM or within 3 days',
      notifRuleWeekendTitle: '📅 Weekend Powder Forecast (Thu/Fri ~19:00)',
      notifRuleWeekendDesc: 'Notify only when weekend snowfall exceeds threshold',
      notifRuleAiTitle: '🤖 AI Japan Powder Award',
      notifRuleAiDesc: 'Alert when spots across Japan get +20cm+ fresh snow even outside Saved',
      notifSpotsHeading: 'Subscribed Spots',
      notifSpotsCountFormat: '{n} Spots',
      notifSelectAllFav: 'Select All Saved',
      notifFilterFav: '⭐ Saved',
      notifFilterSelected: 'Selected Only',
      notifEmptyFav: 'No Saved Spots yet. You can also pick from region tabs above.',
      notifEmptyRegion: 'No spots found',
      notifSavedAlert: 'Notification settings saved',
      toastPushUnsupported: 'Push notifications not available in this environment',
      toastPushDisabled: 'Push notifications disabled',
      toastPushDenied: 'Notification permission denied',
      toastPushEnabled: '❄️ Push notifications enabled!',
      toastPushError: 'Failed to update notification settings',
      testNotifTitle: '❄️ POWDER BASE Test Alert',
      testNotifBody: 'Notifications are connected! (Threshold: +{threshold}cm snowfall & weekend alerts)',
      toastTestNotifError: 'Failed to send test notification',

      // Guide / Help Modal
      guideDefaultTitle: 'User Guide',
      guideDefaultSub: 'How to Read & Tips',
      closeBtn: 'Close',

      // Share Modal
      shareModalTitle: 'Share Snow Report',
      shareModalSub: 'Share conditions with friends',
      shareNativeBtn: 'Share via Device Menu',
      shareLineBtn: 'Share on LINE',
      shareXBtn: 'Post on X (Twitter)',
      shareCopyUrlBtn: 'Copy URL Link',
      copyShortBtn: 'Copy',
      shareSpotTitleFormat: '{name} - Snow & Powder Report',
      shareSpotSubFormat: 'Snow Score: {score}{pt} ({tag})',
      toastUrlCopied: '📋 URL copied to clipboard!',
      toastShareCopied: '📋 Share text & URL copied!',

      // Search Modal
      searchModalPlaceholder: 'Search ski resort, mountain, or area...',

      // Report Modal
      reportModalTitle: 'Post Snow Report',
      reportModalSub: 'Share live snow quality & conditions',
      reportSpotField: 'Spot',
      reportTimeSlotField: 'Time Slot',
      slotFirstChair: 'First Chair',
      slotMorning: 'Morning',
      slotAfternoon: 'Afternoon',
      slotNight: 'Night Ski',
      reportRatingField: 'Rating',
      scorePtUnit: ' pts',
      scorePtsFormat: '{n} pts',
      reportSnowTypeField: 'Snow / Surface',
      optEpicPow: 'Epic Pow',
      optDeepPow: 'Deep Pow',
      optGoodPow: 'Good Pow',
      optLightPow: 'Light Pow',
      optHeavyPow: 'Heavy Pow',
      optPacked: 'Packed Snow',
      optCorn: 'Spring Corn',
      optIce: 'Ice / Firm',
      optRainMelt: 'Rain / Melt',
      reportSnowDepthField: 'Fresh Snow Depth',
      optDepthNone: 'None',
      optDepthAnkle: 'Ankle 5-15cm',
      optDepthShin: 'Shin 15-30cm',
      optDepthKnee: 'Knee 30-50cm',
      optDepthThigh: 'Thigh 50-70cm',
      optDepthWaist: 'Waist 70-100cm',
      optDepthChest: 'Chest+ 100cm+',
      reportCommentField: 'Field Notes (Optional)',
      reportCommentPlaceholder: 'e.g. Light fresh powder on first chair, great visibility...',
      submitReportBtn: 'Submit Snow Report',
      submittingBtn: 'Submitting...',
      reportFooterNote: '* Shared instantly in real-time with riders across Japan',
      reportSuccessAlert: '[Report Submitted]\n{spot}\n{slot} / {snow}\n\nThank you! Your report is now shared in real-time.',
      reportOfflineAlert: 'Snow report saved! (Offline mode)',
      reportCooldownAlert: '[Cooldown Limit]\nTo prevent duplicates, posting to the same spot is limited to once every 30 minutes.\nPlease wait about {mins} more min(s).'
    }
  };

  window.TRANSLATIONS = TRANSLATIONS;

  // ==========================================
  // 2. データタグ・気象・アラート変換辞書 (tTag)
  // ==========================================
  const TAG_DICT_EN = {
    // スコアランク & メインタグ
    '積雪不足': 'Low Snow',
    '積雪なし': 'No Snow',
    '滑走不可': 'Closed',
    '積雪不足 (滑走不可)': 'Low Snow (Closed)',
    '積雪なし (入山不可)': 'No Snow (Closed)',
    '🌱 積雪なし (滑走不可)': '🌱 No Snow (Closed)',
    '積雪不足・滑走不可': 'Low Snow / Closed',
    '積雪なし・滑走不可': 'No Snow / Closed',
    'しまり雪': 'Packed Snow',
    '安定しまり雪': 'Stable Packed',
    '山岳しまり雪': 'Mountain Packed',
    '圧雪良好': 'Good Groomed',
    '良好グリップ': 'Good Grip',
    '安定コンディション': 'Stable Conditions',
    '上質バーン': 'Prime Groomers',
    '神パウ': 'Epic Pow',
    '極上パウ': 'Deep Pow',
    '良質パウ': 'Good Pow',
    'ちょいパウ': 'Light Pow',
    '重パウ': 'Heavy Pow',
    'ザラメ雪': 'Spring Corn',
    'アイスバーン': 'Ice / Firm',
    'アイス・クラスト': 'Ice / Crust',
    '硬雪・クラスト': 'Hard / Crust',
    '雨・融雪': 'Rain / Melt',
    'パウダー良好': 'Good Powder',
    '❄️ パウダー': '❄️ Powder',

    // 新雪リセット・深さタグ
    '降雪なし': 'No Snowfall',
    'うっすら': 'Dusting',
    'うっすら新雪': 'Light Fresh',
    'くるぶし': 'Ankle Deep',
    'くるぶしパウ': 'Ankle Pow',
    'すね': 'Shin Deep',
    'スネパウ': 'Shin Pow',
    'ヒザパウ': 'Knee Pow',
    'モモパウ': 'Thigh Pow',
    '腰パウ': 'Waist Pow',
    '新雪なし': 'None',
    'なし': 'None',
    'くるぶし 5〜15cm': 'Ankle 5-15cm',
    'すね 15〜30cm': 'Shin 15-30cm',
    'ひざ 30〜50cm': 'Knee 30-50cm',
    'もも 50〜70cm': 'Thigh 50-70cm',
    '腰 70〜100cm': 'Waist 70-100cm',
    '胸以上 100cm+': 'Chest+ 100cm+',

    // サブタグ・詳細バーン状態
    '極上ドライパウダー': 'Ultra Dry Powder',
    'ドライパウダー': 'Dry Powder',
    '底付きなし': 'Bottomless',
    'ラッセル覚悟': 'Deep Trail Breaking',
    '完全リセット': 'Full Reset',
    '極上シルキー': 'Silky Smooth',
    '浮遊感': 'Floaty',
    '浮遊感あり': 'Good Float',
    '重め新雪・雪崩注意': 'Heavy Snow / Avy Caution',
    '水分多め': 'High Moisture',
    '重め新雪': 'Heavy Fresh Snow',
    '負荷増大': 'High Physical Load',
    'ノートラック期待': 'Untracked Potential',
    '急増雪注意': 'Rapid Snow Caution',
    '弱層・クラスト警戒': 'Weak Layer / Crust Alert',
    '底付き注意': 'Firm Base Underneath',
    '下層クラスト': 'Sub-surface Crust',
    '雪崩リスク留意': 'Mind Avalanche Risk',
    '下地硬め': 'Firm Base',
    '面ツルリセット': 'Smooth Reset',
    '新雪良好': 'Good Fresh Snow',
    'クラスト上の新雪': 'Fresh on Crust',
    '弱層注意': 'Weak Layer Caution',
    'うっすら新雪・下地注意': 'Light Fresh / Mind Base',
    '下地注意': 'Mind Base',
    '面選び重要': 'Choose Aspect Carefully',
    'トラック消えかけ': 'Tracks Filling In',
    '硬雪・滑落注意': 'Hard Snow / Slide Risk',
    'スリップ注意': 'Slick Surface',
    '下層硬め': 'Firm Underneath',
    'クトー・アイゼン要': 'Ski Crampons / Crampons Req.',
    'エッジ必須': 'Sharp Edges Needed',
    'うっすら化粧雪': 'Light Dusting on Top',
    '下地パック雪': 'Packed Base',
    'クラスト・滑落警戒': 'Crust / Slide Hazard',
    '下層ガリガリ': 'Icy Underneath',
    'アイゼン推奨': 'Crampons Recommended',
    'エッジ注意': 'Watch Your Edges',
    '滑落警戒': 'Slide Hazard',
    '春ザラメ・グライド注意': 'Spring Corn / Glide Caution',
    'シャバ雪': 'Slushy Snow',
    '春雪': 'Spring Snow',
    '全層雪崩注意': 'Full-Depth Avy Caution',
    'ワックス要': 'Wax Recommended',
    '行動しやすい': 'Easy Travel',
    'スピード爽快': 'Fast & Fun',
    'ウインドパック・風成雪': 'Wind Pack / Wind Slab',
    '強風・風パック': 'Wind Packed',
    '地吹雪注意': 'Blowing Snow',
    '積雪30cm未満': 'Snow < 30cm',
    '積雪100cm未満': 'Snow < 100cm',
    '積雪浅め': 'Shallow Cover',
    '積雪ゼロ': '0cm Snow',
    '薮・岩露出注意': 'Brush / Rocks Exposed',
    '藪・岩露出注意': 'Brush / Rocks Exposed',
    '薮・地形露出注意': 'Brush / Terrain Exposed',
    'ブッシュ・石注意': 'Thin Cover / Rocks',
    'ブッシュ注意': 'Watch for Brush',
    '悪天・湿雪雪崩注意': 'Bad Wx / Wet Avy Caution',
    '雨天・雪面悪化': 'Rain / Poor Surface',
    '融雪注意': 'Melting Snow',
    '入山見送り検討': 'Consider Postponing',
    '防水ウェア必須': 'Waterproof Gear Req.',
    '雪質安定': 'Stable Snow',
    '山岳安定': 'Stable',
    '比較的安定': 'Relatively Stable',
    'コンディション確認': 'Check Conditions',

    // 時間帯
    '朝イチ': 'First Chair',
    '午前': 'Morning',
    '午後': 'Afternoon',
    'ナイター': 'Night Ski',
    'たった今': 'Just now',
    '本日': 'Today',

    // 曜日
    '日': 'Sun',
    '月': 'Mon',
    '火': 'Tue',
    '水': 'Wed',
    '木': 'Thu',
    '金': 'Fri',
    '土': 'Sat',

    // 天気ラベル
    '快晴': 'Clear',
    '晴れ': 'Sunny',
    '晴れ/薄曇': 'Partly Cloudy',
    '曇り': 'Cloudy',
    '霧/濃霧': 'Fog',
    '霧雨': 'Drizzle',
    '雨': 'Rain',
    'みぞれ': 'Sleet',
    'にわか雨': 'Shower',
    '小雪': 'Light Snow',
    '雪': 'Snow',
    '大雪': 'Heavy Snow',
    '吹雪': 'Blizzard',
    '雷雨/荒天': 'Thunderstorm'
  };

  // ==========================================
  // 3. ヘルプ・ガイドモーダル用データ (ja / en)
  // ==========================================
  window.GUIDE_HELP_I18N = {
    ja: {
      hero: {
        title: '実況 ＆ 雪質スコアの見方',
        subtitle: '雪質スコア・積雪実測・気温・風速',
        icon: 'fa-solid fa-snowflake',
        iconBg: 'bg-sky-50 text-sky-700 border-sky-200',
        html: `
          <div class="space-y-2.5">
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-star text-amber-500"></i>
                <span>ゲレンデ雪質スコア（0〜100点）</span>
              </div>
              <ul class="text-xs text-slate-700 space-y-1.5 pl-3.5 list-disc leading-relaxed">
                <li><strong class="text-sky-800">80〜100点（極上パウダー）</strong>：新雪十分＆氷点下！羽毛のような極上ドライスノーが期待できる最高のコンディション。</li>
                <li><strong class="text-teal-800">65〜79点（パウダー・良好）</strong>：適度な新雪または引き締まった圧雪バーン。快適にフリーランやターンが楽しめます。</li>
                <li><strong class="text-slate-800">50〜64点（圧雪良好・標準）</strong>：日中の昇温やパックされたバーン。グルーミングバーンを楽しめます。</li>
                <li><strong class="text-amber-800">30〜49点（湿雪・アイスバーン注意）</strong>：昇温によるシャバ雪、または夜間の冷え込みによる硬い再凍結クラストに注意。</li>
                <li><strong class="text-rose-800">0〜29点（積雪不足・滑走不可）</strong>：ブッシュ露出や降雨、積雪30cm未満。板の傷や転倒に十分警戒してください。</li>
              </ul>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-tower-broadcast text-emerald-700"></i>
                <span>公的積雪実測（道路雪量計 ＆ 気象庁アメダス）</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                現場至近の「国土交通省 道路雪量計（峠・山間部）」および「気象庁アメダス」が観測した生の積雪深・増減を表示しています。机上の計算だけでなく、近隣の山で今まさに雪が何cm積もっているかの真実が分かります。
              </p>
            </div>
          </div>
        `
      },
      heroBc: {
        title: '山岳コンディション ＆ BCリスクの見方',
        subtitle: '安全スコア・雪崩警戒アラート・積雪実測',
        icon: 'fa-solid fa-mountain',
        iconBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        html: `
          <div class="space-y-2.5">
            <div class="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div class="font-bold text-emerald-950 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-shield-halved text-emerald-700"></i>
                <span>山岳安全コンディション（0〜100点）</span>
              </div>
              <p class="text-xs text-emerald-950/90 leading-relaxed mb-2">
                バックカントリーでは単なるパウダースノーの深さではなく、<strong>「雪崩・暴風・弱層・埋没リスク」</strong>を加味した安全重視の判定を行います。
              </p>
              <ul class="text-xs text-slate-700 space-y-1.5 pl-3.5 list-disc leading-relaxed">
                <li><strong class="text-rose-800">🔴 入山警戒（スコア上限45点）</strong>：稜線暴風（15m/s〜）・24h急増雪（40cm〜）・降雨や急昇温（+6℃〜）による全層/表層雪崩警戒時。安全のため入山見送りを強く推奨。</li>
                <li><strong class="text-amber-800">🟡 山岳注意（スコア上限75点）</strong>：強風（10m/s〜）・気温0℃以上・再凍結クラスト上の新雪弱層・積雪100cm未満（薮/岩露出）など要注意コンディション。</li>
                <li><strong class="text-emerald-800">🟢 比較的安定（75〜99点）</strong>：十分な積雪深があり、極端な昇温や暴風のない好天しまり雪〜良質ドライパウダー。</li>
                <li><strong class="text-slate-800">積雪不足（滑走不可）</strong>：積雪30cm未満。岩やブッシュが露出し入山不可。</li>
              </ul>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-tower-broadcast text-emerald-700"></i>
                <span>公的積雪実測（道路雪量計 ＆ 気象庁アメダス）</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                山岳エリアや峠に設置された国土交通省の道路雪量計、および気象庁アメダスのリアルタイム実測深を表示。現場アプローチ時の積雪状況を把握できます。
              </p>
            </div>
          </div>
        `
      },
      overnight: {
        title: 'OVERNIGHT SNOW（夜間新雪）の見方',
        subtitle: '18:00〜翌朝06:00に降り積もる新雪リセット量',
        icon: 'fa-solid fa-moon',
        iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
        html: `
          <div class="space-y-2.5">
            <div class="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
              <div class="font-bold text-amber-950 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-sparkles text-amber-600"></i>
                <span>朝イチパウダーの鍵「リセット雪」</span>
              </div>
              <p class="text-xs text-amber-950/90 leading-relaxed">
                スキー場がクローズした夕方18:00から、翌朝ゴンドラ運行前の06:00までの12時間に山頂へ降り積もる純粋な降雪量を積算しています。
              </p>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-layer-group text-sky-700"></i>
                <span>狙い目の新雪目安</span>
              </div>
              <ul class="text-xs text-slate-700 space-y-1 pl-3.5 list-disc leading-relaxed">
                <li><strong>+15cm以上</strong>：リセット確定！ゲレンデトップや非圧雪コースで浮遊感パウダーを楽しめる絶好のサイン。</li>
                <li><strong>+30cm以上</strong>：THE DAY級の大雪！太板（ファットスキー/パウダーボード）必須のディープパウダー。</li>
                <li><strong>+5〜14cm</strong>：コース脇や薄パウが気持ちいいグッドコンディション。</li>
              </ul>
            </div>
          </div>
        `
      },
      trend: {
        title: 'SNOW TREND（推移グラフ）の見方',
        subtitle: '過去のアメダス実績 ＋ 今後7日間のシームレス予報',
        icon: 'fa-solid fa-chart-line',
        iconBg: 'bg-sky-50 text-sky-700 border-sky-200',
        html: `
          <div class="space-y-2.5">
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span class="w-3 h-0.5 bg-sky-700 inline-block"></span>
                <span>青い実線：山頂の積雪深（cm）</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                山全体のベース積雪量です。過去から未来にかけて右肩上がりならまとまった降雪期、横ばい・低下なら融解や沈降傾向です。
              </p>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span class="w-3 h-0.5 bg-orange-600 inline-block"></span>
                <span>オレンジの棒：1時間あたりの降雪量（cm/h）</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                どの時間帯に最も強い雪雲が通過するかを表します。高い棒が集中している時間帯（3cm/h以上）は大雪・パウダーリセットのチャンスです。
              </p>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-sm bg-sky-600/70 border border-sky-700 inline-block"></span>
                <span>水色の棒：雨（mm/h）</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                気温が上昇して雪ではなく雨となる時間帯です。山麓で雨、山頂で雪といった境界もタイムラインと併せてチェックできます。
              </p>
            </div>
          </div>
        `
      },
      timeline: {
        title: 'TIMELINE（時間予報）の見方',
        subtitle: '1時間ごとの天候・降雪量・気温・風速・標高切替',
        icon: 'fa-solid fa-clock',
        iconBg: 'bg-sky-50 text-sky-700 border-sky-200',
        html: `
          <div class="space-y-2.5">
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-arrows-up-down text-sky-700"></i>
                <span>トップ（山頂）とベース（山麓）の切替</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                上部の「ベース」「トップ」ボタンで標高を即座に切り替えられます。山麓では雨でも山頂ではパウダースノーといった標高差によるコンディションの違いを把握できます。
              </p>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-wind text-orange-600"></i>
                <span>風速とリフト運行目安</span>
              </div>
              <ul class="text-xs text-slate-700 space-y-1 pl-3.5 list-disc leading-relaxed">
                <li><strong>0〜4m/s（弱風）</strong>：穏やかで最高のクルージング日和。</li>
                <li><strong>5〜9m/s（やや強風）</strong>：山頂リフトで体感温度低下。防寒対策を。</li>
                <li><strong class="text-orange-700">10〜14m/s（強風）</strong>：ゴンドラ・山頂高速リフトが減速運転または一時見合わせの可能性。</li>
                <li><strong class="text-rose-700">15m/s以上（暴風）</strong>：リフト運休警戒レベル。稜線での視界不良（ホワイトアウト）に警戒。</li>
              </ul>
            </div>
          </div>
        `
      },
      guide: {
        title: 'POWDER BASE 使い方ガイド',
        subtitle: '全国547スポットの雪質・予報を1秒でチェック',
        icon: 'fa-solid fa-book-open',
        iconBg: 'bg-sky-50 text-sky-700 border-sky-200',
        html: `
          <div class="space-y-2.5">
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-sliders text-sky-700"></i>
                <span>① エリア・スポットをワンタップ選択</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                上部の「地方」「エリア」セレクター、またはピルタブから気になるスキー場やバックカントリー山を選びます。🔍検索ボタンで全国のスポットを直接インクリメンタル検索も可能です。
              </p>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-moon text-amber-600"></i>
                <span>② 朝イチパウダーは「夜間新雪」を確認</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                オレンジの「OVERNIGHT SNOW」カードで、昨晩から今朝にかけてどれだけ新雪がリセットされたかをチェック。+15cm以上ならパウダー狙いで早起きしましょう！
              </p>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-star text-amber-500"></i>
                <span>③ MYスポットに登録</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                よく行くスキー場や気になる山はスポット名横の「★」をタップしてMYスポットに登録。いつでも素早く切り替えられるほか、大雪時のプッシュ通知対象にも設定できます。
              </p>
            </div>
          </div>
        `
      }
    },
    en: {
      hero: {
        title: 'Live Data & Snow Score Guide',
        subtitle: 'Snow Score, Live Observation, Temp & Wind',
        icon: 'fa-solid fa-snowflake',
        iconBg: 'bg-sky-50 text-sky-700 border-sky-200',
        html: `
          <div class="space-y-2.5">
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-star text-amber-500"></i>
                <span>Resort Snow Quality Score (0–100 pts)</span>
              </div>
              <ul class="text-xs text-slate-700 space-y-1.5 pl-3.5 list-disc leading-relaxed">
                <li><strong class="text-sky-800">80–100 pts (Epic / Deep Powder)</strong>: Plenty of fresh snow & sub-zero temps! Feather-light dry Japanese powder.</li>
                <li><strong class="text-teal-800">65–79 pts (Good Powder / Packed)</strong>: Fresh snow or crisp groomed runs. Great for freeriding & carving.</li>
                <li><strong class="text-slate-800">50–64 pts (Standard Groomed)</strong>: Daytime warming or firm packed snow. Fun on groomed trails.</li>
                <li><strong class="text-amber-800">30–49 pts (Wet / Icy Caution)</strong>: Slushy snow from warming or refrozen crust after a freeze.</li>
                <li><strong class="text-rose-800">0–29 pts (Low Snow / Closed)</strong>: Exposed brush, rain, or snow depth under 30cm.</li>
              </ul>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-tower-broadcast text-emerald-700"></i>
                <span>Public Live Snow Depth (Road Gauge & AMeDAS)</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                Displays real-time hourly snow depth observed by MLIT mountain road snow gauges and JMA AMeDAS weather stations.
              </p>
            </div>
          </div>
        `
      },
      heroBc: {
        title: 'Backcountry Safety & Risk Guide',
        subtitle: 'Safety Score, Avalanche Warnings, Live Observation',
        icon: 'fa-solid fa-mountain',
        iconBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        html: `
          <div class="space-y-2.5">
            <div class="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div class="font-bold text-emerald-950 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-shield-halved text-emerald-700"></i>
                <span>Mountain Safety Condition (0–100 pts)</span>
              </div>
              <p class="text-xs text-emerald-950/90 leading-relaxed mb-2">
                In backcountry zones, our engine prioritizes <strong>avalanche risk, gale-force winds, weak layers, and terrain traps</strong> over simple powder depth.
              </p>
              <ul class="text-xs text-slate-700 space-y-1.5 pl-3.5 list-disc leading-relaxed">
                <li><strong class="text-rose-800">🔴 High Risk / Warning (Capped at 45 pts)</strong>: Ridge gale (15m/s+), rapid snowfall dump (40cm/24h+), rainfall or rapid warmup (+6℃/24h). Postponing trips is strongly advised.</li>
                <li><strong class="text-amber-800">🟡 Moderate Risk / Caution (Capped at 75 pts)</strong>: Strong wind (10m/s+), temp above 0℃, buried crust weak layer, or base snow depth under 100cm (exposed rocks/crevasses).</li>
                <li><strong class="text-emerald-800">🟢 Relatively Stable (75–99 pts)</strong>: Ample base snowpack, no severe warming or gale, good packed snow to dry powder.</li>
                <li><strong class="text-slate-800">No Snow / Unskiable</strong>: Snow depth under 30cm. Exposed rocks and bush.</li>
              </ul>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-tower-broadcast text-emerald-700"></i>
                <span>Public Live Snow Depth (Road Gauge & AMeDAS)</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                Displays live snow depth from MLIT highway/pass gauges and JMA AMeDAS stations around trailheads and mountain passes.
              </p>
            </div>
          </div>
        `
      },
      overnight: {
        title: 'Overnight Snow Guide',
        subtitle: 'Fresh snowfall reset from 18:00 to 06:00',
        icon: 'fa-solid fa-moon',
        iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
        html: `
          <div class="space-y-2.5">
            <div class="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
              <div class="font-bold text-amber-950 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-sparkles text-amber-600"></i>
                <span>The Key to First Chair Powder</span>
              </div>
              <p class="text-xs text-amber-950/90 leading-relaxed">
                Calculates pure cumulative snowfall at the summit during the 12 hours from lift close (18:00) to early morning (06:00).
              </p>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-layer-group text-sky-700"></i>
                <span>Fresh Snow Benchmarks</span>
              </div>
              <ul class="text-xs text-slate-700 space-y-1 pl-3.5 list-disc leading-relaxed">
                <li><strong>+15cm+</strong>: Tracks reset! Great float on upper mountain & ungroomed runs.</li>
                <li><strong>+30cm+</strong>: "THE DAY" deep dump! Bring your fat skis or powder board.</li>
                <li><strong>+5–14cm</strong>: Fun soft turns on side-country & groomed runs.</li>
              </ul>
            </div>
          </div>
        `
      },
      trend: {
        title: 'Snow Trend Chart Guide',
        subtitle: 'Past AMeDAS Live Data + 7-Day Forecast',
        icon: 'fa-solid fa-chart-line',
        iconBg: 'bg-sky-50 text-sky-700 border-sky-200',
        html: `
          <div class="space-y-2.5">
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span class="w-3 h-0.5 bg-sky-700 inline-block"></span>
                <span>Blue Line: Summit Snow Depth (cm)</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                Shows overall snowpack trend. An upward slope indicates active snow accumulation; flat or downward indicates settling or melt.
              </p>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span class="w-3 h-0.5 bg-orange-600 inline-block"></span>
                <span>Orange Line: Hourly Snowfall (cm/h)</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                Shows when snow clouds peak. Spikes of 3cm/h+ signal heavy snowfall and powder resets.
              </p>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-sm bg-sky-600/70 border border-sky-700 inline-block"></span>
                <span>Light Blue Bars: Rainfall (mm/h)</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                Indicates hours when temperatures rise and precipitation falls as rain instead of snow.
              </p>
            </div>
          </div>
        `
      },
      timeline: {
        title: 'Hourly Timeline Guide',
        subtitle: 'Hourly weather, snowfall, temp, wind & elevation',
        icon: 'fa-solid fa-clock',
        iconBg: 'bg-sky-50 text-sky-700 border-sky-200',
        html: `
          <div class="space-y-2.5">
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-arrows-up-down text-sky-700"></i>
                <span>Switching Base & Top Elevation</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                Toggle "Base" and "Top" at the top right to compare conditions. Even if it's raining at the base, it may be dumping dry powder at the summit.
              </p>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-wind text-orange-600"></i>
                <span>Wind Speed & Lift Operations</span>
              </div>
              <ul class="text-xs text-slate-700 space-y-1 pl-3.5 list-disc leading-relaxed">
                <li><strong>0–4m/s (Calm)</strong>: Ideal cruising conditions.</li>
                <li><strong>5–9m/s (Moderate)</strong>: Chilly on upper lifts; dress warmly.</li>
                <li><strong class="text-orange-700">10–14m/s (Strong)</strong>: Gondolas & upper lifts may run at reduced speed or hold.</li>
                <li><strong class="text-rose-700">15m/s+ (Gale)</strong>: High risk of lift holds & whiteout on ridges.</li>
              </ul>
            </div>
          </div>
        `
      },
      guide: {
        title: 'POWDER BASE User Guide',
        subtitle: 'Check snow quality & forecasts for 547 Japan spots',
        icon: 'fa-solid fa-book-open',
        iconBg: 'bg-sky-50 text-sky-700 border-sky-200',
        html: `
          <div class="space-y-2.5">
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-sliders text-sky-700"></i>
                <span>1. Select Any Resort or BC Mountain</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                Pick a Region and Area from the top selectors, or use the "Find" button to search all 547 ski resorts & backcountry peaks across Japan.
              </p>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-moon text-amber-600"></i>
                <span>2. Check "Overnight Snow" for First Chair</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                The orange "OVERNIGHT SNOW" card shows how much fresh snow accumulates between 18:00 and 06:00. +15cm+ means a powder morning!
              </p>
            </div>
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div class="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-star text-amber-500"></i>
                <span>3. Save Your Favorite Spots</span>
              </div>
              <p class="text-xs text-slate-700 leading-relaxed">
                Tap the ★ icon next to a spot name to add it to Saved Spots for 1-tap access, side-by-side comparison, and push alerts.
              </p>
            </div>
          </div>
        `
      }
    }
  };

  // ==========================================
  // 4. コア翻訳関数: t(), tName(), tTag(), applyI18n()
  // ==========================================
  window.t = function (key, vars) {
    const lang = window.currentLang || 'ja';
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.ja;
    let str = dict[key] !== undefined ? dict[key] : (TRANSLATIONS.ja[key] !== undefined ? TRANSLATIONS.ja[key] : key);
    if (vars && typeof str === 'string') {
      for (const [k, v] of Object.entries(vars)) {
        str = str.split('{' + k + '}').join(String(v));
      }
    }
    return str;
  };

  window.tName = function (jaName) {
    if (!jaName) return '';
    if (window.currentLang !== 'en') return jaName;
    if (jaName === '北海道') return window.t('regHokkaido');
    if (jaName === '東北') return window.t('regTohoku');
    if (jaName === '信越') return window.t('regShinetsu');
    if (jaName === '北陸') return window.t('regHokuriku');
    if (jaName === '関東') return window.t('regKanto');
    if (jaName === '東海') return window.t('regTokai');
    if (jaName === '関西') return window.t('regKansai');
    if (jaName === '中国' || jaName === '西日本' || jaName === '中国・西日本') return window.t('regWest');
    if (jaName === '四国' || jaName === '四国他') return 'Shikoku';
    if (jaName === '全国') return window.t('regAll');
    if (jaName === '主要エリア') return window.t('mainAreaFallback');
    if (jaName === 'その他エリア') return window.t('otherAreaFallback');
    if (jaName === '山頂ピーク') return window.t('defaultSummitPeak');
    if (jaName === 'ゲレンデトップ') return window.t('defaultResortTop');
    if (jaName === '登山口・ベース') return window.t('defaultTrailheadBase');
    if (jaName === 'ゲレンデベース') return window.t('defaultResortBase');
    if (jaName === '雪山スポット') return 'Snow Spot';
    if (window.enNamesDict && window.enNamesDict[jaName]) {
      return window.enNamesDict[jaName];
    }
    return jaName;
  };

  window.tTag = function (rawStr) {
    if (!rawStr) return '';
    const s = String(rawStr).trim();
    if (window.currentLang !== 'en') return s;

    if (TAG_DICT_EN[s]) return TAG_DICT_EN[s];

    // 絵文字プレフィックス除去後の完全一致チェック
    const stripped = s.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1F02F}\s]+/u, '').trim();
    if (TAG_DICT_EN[stripped]) return TAG_DICT_EN[stripped];

    // 動的数値を含むBCアラートラベル・理由の変換
    let res = s;
    res = res.replace(/^入山警戒\s*\((.+)\)$/, function (_, inner) {
      return 'High Risk (' + window.tTag(inner) + ')';
    });
    res = res.replace(/^山岳注意\s*\((.+)\)$/, function (_, inner) {
      return 'Caution (' + window.tTag(inner) + ')';
    });
    res = res.replace(/稜線暴風\s*\(?(\d+m\/s)\)?/g, 'Ridge Gale ($1)');
    res = res.replace(/稜線暴風\s*(\d+m\/s)/g, 'Ridge Gale $1');
    res = res.replace(/強風・風成雪注意\s*\(?(\d+m\/s)\)?/g, 'Strong Wind / Wind Slab ($1)');
    res = res.replace(/強風\s*(\d+m\/s)/g, 'Strong Wind $1');
    res = res.replace(/急増雪\s*\(?24h:(\d+cm)・雪崩警戒\)?/g, 'Rapid Snow (24h:$1 / Avy Alert)');
    res = res.replace(/急増雪\s*(\d+cm)/g, 'Rapid Snow $1');
    res = res.replace(/風雪による吹き溜まり・スラブ注意/g, 'Wind Drift / Slab Caution');
    res = res.replace(/湿雪・雨による雪崩警戒/g, 'Wet Snow / Rain Avy Alert');
    res = res.replace(/急昇温\s*\(\+(\d+℃)\)・雪崩警戒/g, 'Rapid Warming (+$1) / Avy Alert');
    res = res.replace(/気温0℃以上・湿雪\/グライド注意/g, 'Temp >= 0℃ / Wet & Glide Caution');
    res = res.replace(/気温0℃以上/g, 'Temp >= 0℃');
    res = res.replace(/クラスト上の新雪・弱層注意/g, 'Fresh on Crust / Weak Layer');
    res = res.replace(/積雪100cm未満・薮\/地形注意/g, 'Snow < 100cm / Brush & Terrain');
    res = res.replace(/積雪100cm未満/g, 'Snow < 100cm');
    res = res.replace(/積雪30cm未満/g, 'Snow < 30cm');
    res = res.replace(/悪天候/g, 'Severe Weather');
    res = res.replace(/気象変化/g, 'Weather Change');
    // サンプルレポート等の時刻表記 ("本日 08:45" -> "Today 08:45")
    res = res.replace(/^本日\s+/, 'Today ');
    return res;
  };

  window.applyI18n = function (root) {
    const scope = root || document;
    document.documentElement.lang = window.currentLang || 'ja';

    // フロート言語ボタンのラベル更新（jaの時は "EN"、enの時は "JP"）
    const langLabel = document.getElementById('floatingLangLabel');
    if (langLabel) {
      langLabel.textContent = window.currentLang === 'ja' ? 'EN' : 'JP';
    }

    scope.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = window.t(key);
    });

    scope.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.placeholder = window.t(key);
    });

    scope.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-title');
      if (key) el.title = window.t(key);
    });

    scope.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-html');
      if (key) el.innerHTML = window.t(key);
    });
  };
})();
