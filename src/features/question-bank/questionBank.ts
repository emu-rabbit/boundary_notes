import { isRoleIncludedInScope } from '../secret-file';
import type { QuestionRole, SecretFileScope } from '../secret-file';
import type {
  CategoryQuestion,
  CategoryQuestionsByScope,
  DetailQuestion,
  QuestionBank,
  QuestionBankCategory,
  QuestionBankDetailItem,
  QuestionBankCounts,
} from './types';

function category(
  categoryId: string,
  name: string,
  activeDescription: string,
  passiveDescription: string,
  itemCount: number,
  includeInCategoryRound = true,
): QuestionBankCategory {
  return {
    categoryId,
    detailItems: categoryDetailItems[categoryId] ?? [],
    includeInCategoryRound,
    itemCount,
    name,
    roles: {
      active: {
        description: activeDescription,
      },
      passive: {
        description: passiveDescription,
      },
    },
    sourceSheetName: name,
  };
}

const categoryDetailItems: Record<string, readonly QuestionBankDetailItem[]> = {
  impact_spanking: [
    {
      detailId: 'detail-impact_spanking-1qzzr10',
      label: "用手",
      roles: {
        active: {
          description: "用手拍打對方進行衝擊遊戲"
        },
        passive: {
          description: "被手拍打進行衝擊遊戲"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-gwssxu',
      label: "用皮拍",
      roles: {
        active: {
          description: "用皮拍拍打對方進行衝擊遊戲"
        },
        passive: {
          description: "被皮拍拍打進行衝擊遊戲"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-1uy95nk',
      label: "用木拍",
      roles: {
        active: {
          description: "用木拍拍打對方進行衝擊遊戲"
        },
        passive: {
          description: "被木拍拍打進行衝擊遊戲"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-i4vf80',
      label: "用木條",
      roles: {
        active: {
          description: "用木條打擊對方進行衝擊遊戲"
        },
        passive: {
          description: "被木條打擊進行衝擊遊戲"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-i4t2fc',
      label: "用硬塑膠/壓克力",
      roles: {
        active: {
          description: "用硬塑膠/壓克力打擊對方進行衝擊遊戲"
        },
        passive: {
          description: "被硬塑膠/壓克力打擊進行衝擊遊戲"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-1uxz7gx',
      label: "用軟塑膠",
      roles: {
        active: {
          description: "用軟塑膠打擊對方進行衝擊遊戲"
        },
        passive: {
          description: "被軟塑膠打擊進行衝擊遊戲"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-1lmlugr',
      label: "用熱溶膠條",
      roles: {
        active: {
          description: "用熱溶膠條打擊對方進行衝擊遊戲"
        },
        passive: {
          description: "被熱溶膠條打擊進行衝擊遊戲"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-1bcfzjw',
      label: "用藤條",
      roles: {
        active: {
          description: "用藤條打擊對方進行衝擊遊戲"
        },
        passive: {
          description: "被藤條打擊進行衝擊遊戲"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-14bm3qs',
      label: "用梳子",
      roles: {
        active: {
          description: "用梳子拍打對方進行衝擊遊戲"
        },
        passive: {
          description: "被梳子拍打進行衝擊遊戲"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-1i2vvrm',
      label: "泛紅的程度",
      roles: {
        active: {
          description: "拍打對方到泛紅的程度"
        },
        passive: {
          description: "被拍打到泛紅的程度"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-t3fgz5',
      label: "小瘀青的程度",
      roles: {
        active: {
          description: "拍打對方到小瘀青的程度"
        },
        passive: {
          description: "被拍打到小瘀青的程度"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-1ijb2cv',
      label: "大範圍重瘀青的程度",
      roles: {
        active: {
          description: "拍打對方到大範圍重瘀青的程度"
        },
        passive: {
          description: "被拍打到大範圍重瘀青的程度"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-19dbc6o',
      label: "破皮滲組織液的程度",
      roles: {
        active: {
          description: "拍打對方到破皮滲組織液的程度"
        },
        passive: {
          description: "被拍打到破皮滲組織液的程度"
        }
      },
      warning: "注意傷口後續保養與處理"
    },
    {
      detailId: 'detail-impact_spanking-1q2onnn',
      label: "破皮流血的程度",
      roles: {
        active: {
          description: "拍打對方到破皮流血的程度"
        },
        passive: {
          description: "被拍打到破皮流血的程度"
        }
      },
      warning: "注意傷口後續保養與處理"
    },
    {
      detailId: 'detail-impact_spanking-1744x4z',
      label: "拍打屁股",
      roles: {
        active: {
          description: "拍打對方的屁股"
        },
        passive: {
          description: "被拍打屁股"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-915jo9',
      label: "拍打胸部",
      roles: {
        active: {
          description: "拍打對方的胸部"
        },
        passive: {
          description: "被拍打胸部"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-9ncnsk',
      label: "拍打生殖器",
      roles: {
        active: {
          description: "拍打對方的生殖器"
        },
        passive: {
          description: "被拍打生殖器"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-syc2dj',
      label: "拍打大腿",
      roles: {
        active: {
          description: "拍打對方的大腿"
        },
        passive: {
          description: "被拍打大腿"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-1lby5ih',
      label: "拍打腳底",
      roles: {
        active: {
          description: "拍打對方的腳底"
        },
        passive: {
          description: "被拍打腳底"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-18swthz',
      label: "拍打手心",
      roles: {
        active: {
          description: "拍打對方的手心"
        },
        passive: {
          description: "被拍打手心"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-1pli4vm',
      label: "趴在膝蓋上打",
      roles: {
        active: {
          description: "讓對方趴在自己膝蓋上的姿勢進行拍打"
        },
        passive: {
          description: "趴在對方膝蓋上的姿勢被拍打"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-m08x3j',
      label: "包尿布式姿勢打",
      roles: {
        active: {
          description: "讓對方擺出包尿布的姿勢進行拍打"
        },
        passive: {
          description: "擺出包尿布的姿勢被拍打"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-yjl4cm',
      label: "站姿打",
      roles: {
        active: {
          description: "讓對方站著進行拍打"
        },
        passive: {
          description: "站著被對方拍打"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-impact_spanking-cnf6uz',
      label: "墊腳打",
      roles: {
        active: {
          description: "讓對方在墊腳狀態下進行拍打"
        },
        passive: {
          description: "在墊腳狀態下被對方拍打"
        }
      },
      warning: null
    }
  ],
  whipping: [
    {
      detailId: 'detail-whipping-9q3jnv',
      label: "用散鞭",
      roles: {
        active: {
          description: "用散鞭鞭打對方進行衝擊遊戲"
        },
        passive: {
          description: "被散鞭鞭打進行衝擊遊戲"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-whipping-1w83a3j',
      label: "用長鞭",
      roles: {
        active: {
          description: "用長鞭鞭打對方進行衝擊遊戲"
        },
        passive: {
          description: "被長鞭鞭打進行衝擊遊戲"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-whipping-d25qdd',
      label: "用音爆鞭",
      roles: {
        active: {
          description: "用音爆鞭鞭打對方進行衝擊遊戲"
        },
        passive: {
          description: "被音爆鞭鞭打進行衝擊遊戲"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-whipping-pt4u3j',
      label: "用皮帶",
      roles: {
        active: {
          description: "用皮帶鞭打對方進行衝擊遊戲"
        },
        passive: {
          description: "被皮帶鞭打進行衝擊遊戲"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-whipping-2nwvqy',
      label: "泛紅的程度",
      roles: {
        active: {
          description: "鞭打對方到泛紅的程度"
        },
        passive: {
          description: "被鞭打到泛紅的程度"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-whipping-sw4wfd',
      label: "小瘀青的程度",
      roles: {
        active: {
          description: "鞭打對方到小瘀青的程度"
        },
        passive: {
          description: "被鞭打到小瘀青的程度"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-whipping-hekt6v',
      label: "大範圍重瘀青的程度",
      roles: {
        active: {
          description: "鞭打對方到大範圍重瘀青的程度"
        },
        passive: {
          description: "被鞭打到大範圍重瘀青的程度"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-whipping-k3sn5k',
      label: "破皮滲組織液的程度",
      roles: {
        active: {
          description: "鞭打對方到破皮滲組織液的程度"
        },
        passive: {
          description: "被鞭打到破皮滲組織液的程度"
        }
      },
      warning: "注意傷口後續保養與處理"
    },
    {
      detailId: 'detail-whipping-1oyyq0b',
      label: "破皮流血的程度",
      roles: {
        active: {
          description: "鞭打對方到破皮流血的程度"
        },
        passive: {
          description: "被鞭打到破皮流血的程度"
        }
      },
      warning: "注意傷口後續保養與處理"
    },
    {
      detailId: 'detail-whipping-15c25xn',
      label: "鞭打屁股",
      roles: {
        active: {
          description: "鞭打對方的屁股"
        },
        passive: {
          description: "被鞭打屁股"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-whipping-1f72zmt',
      label: "鞭打背部",
      roles: {
        active: {
          description: "鞭打對方的背部"
        },
        passive: {
          description: "被鞭打背部"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-whipping-1lvzphd',
      label: "鞭打胸部",
      roles: {
        active: {
          description: "鞭打對方的胸部"
        },
        passive: {
          description: "被鞭打胸部"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-whipping-1kkr5xo',
      label: "鞭打生殖器",
      roles: {
        active: {
          description: "鞭打對方的生殖器"
        },
        passive: {
          description: "被鞭打生殖器"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-whipping-pby8ov',
      label: "鞭打大腿",
      roles: {
        active: {
          description: "鞭打對方的大腿"
        },
        passive: {
          description: "被鞭打大腿"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-whipping-1bop80o',
      label: "鞭打腹部",
      roles: {
        active: {
          description: "鞭打對方的腹部"
        },
        passive: {
          description: "被鞭打腹部"
        }
      },
      warning: null
    }
  ],
  bondage: [
    {
      detailId: 'detail-bondage-122x6cf',
      label: "用麻繩",
      roles: {
        active: {
          description: "用麻繩拘束對方並限制行動"
        },
        passive: {
          description: "被麻繩拘束並限制行動"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-bondage-1tiowlt',
      label: "用棉繩",
      roles: {
        active: {
          description: "用棉繩拘束對方並限制行動"
        },
        passive: {
          description: "被棉繩拘束並限制行動"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-bondage-3cl427',
      label: "用皮帶",
      roles: {
        active: {
          description: "用皮帶拘束對方並限制行動"
        },
        passive: {
          description: "被皮帶拘束並限制行動"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-bondage-1fq32i8',
      label: "用手銬",
      roles: {
        active: {
          description: "用手銬拘束對方並限制行動"
        },
        passive: {
          description: "被手銬拘束並限制行動"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-bondage-1b5wnt',
      label: "用鎖鏈",
      roles: {
        active: {
          description: "用鎖鏈拘束對方並限制行動"
        },
        passive: {
          description: "被鎖鏈拘束並限制行動"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-bondage-1atcv41',
      label: "用布/布條",
      roles: {
        active: {
          description: "用布或布條拘束對方並限制行動"
        },
        passive: {
          description: "被布或布條拘束並限制行動"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-bondage-1pcf9zg',
      label: "用靜電膠帶",
      roles: {
        active: {
          description: "用靜電膠帶拘束對方並限制行動"
        },
        passive: {
          description: "被靜電膠帶拘束並限制行動"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-bondage-1eqwak3',
      label: "用大型拘束家具",
      roles: {
        active: {
          description: "用大型拘束家具拘束對方並限制行動"
        },
        passive: {
          description: "被大型拘束家具拘束並限制行動"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-bondage-14lh93b',
      label: "用小型情趣道具",
      roles: {
        active: {
          description: "用小型情趣道具拘束對方並限制行動"
        },
        passive: {
          description: "被小型情趣道具拘束並限制行動"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-bondage-9mjx48',
      label: "用肢體壓制",
      roles: {
        active: {
          description: "用自己的肢體壓制對方並限制行動"
        },
        passive: {
          description: "被對方用肢體壓制並限制行動"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-bondage-1b013pq',
      label: "約十分鐘內的長度",
      roles: {
        active: {
          description: "將對方拘束約十分鐘內"
        },
        passive: {
          description: "被拘束約十分鐘內"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-bondage-spf6ae',
      label: "約十分鐘到一小時的長度",
      roles: {
        active: {
          description: "將對方拘束約十分鐘到一小時"
        },
        passive: {
          description: "被拘束約十分鐘到一小時"
        }
      },
      warning: "注意麻木、痠痛與血液循環狀態"
    },
    {
      detailId: 'detail-bondage-m6v84b',
      label: "約一小時到三小時的長度",
      roles: {
        active: {
          description: "將對方拘束約一小時到三小時"
        },
        passive: {
          description: "被拘束約一小時到三小時"
        }
      },
      warning: "注意長時間姿勢壓迫、血液循環與補水休息"
    },
    {
      detailId: 'detail-bondage-1ey2gp4',
      label: "多於三小時的長度",
      roles: {
        active: {
          description: "將對方拘束多於三小時"
        },
        passive: {
          description: "被拘束多於三小時"
        }
      },
      warning: "注意長時間拘束造成的血液循環、神經壓迫與身心壓力"
    },
    {
      detailId: 'detail-bondage-mueg5n',
      label: "拘束手部",
      roles: {
        active: {
          description: "拘束對方的手部並限制行動"
        },
        passive: {
          description: "被拘束手部並限制行動"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-bondage-o3hqfj',
      label: "拘束腿部",
      roles: {
        active: {
          description: "拘束對方的腿部並限制行動"
        },
        passive: {
          description: "被拘束腿部並限制行動"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-bondage-1vyd9h5',
      label: "拘束全身",
      roles: {
        active: {
          description: "拘束對方全身並限制行動"
        },
        passive: {
          description: "被拘束全身並限制行動"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-bondage-gyoc0q',
      label: "吊縛",
      roles: {
        active: {
          description: "將對方吊縛起來並限制行動"
        },
        passive: {
          description: "被吊縛起來並限制行動"
        }
      },
      warning: "注意吊縛風險，需經驗、監看與緊急解放方式"
    },
    {
      detailId: 'detail-bondage-bagc3e',
      label: "木乃伊",
      roles: {
        active: {
          description: "將對方包覆成木乃伊狀態並限制行動"
        },
        passive: {
          description: "被包覆成木乃伊狀態並限制行動"
        }
      },
      warning: "注意呼吸、散熱、血液循環與恐慌反應"
    }
  ],
  tickling: [
    {
      detailId: 'detail-tickling-hvz7o9',
      label: "用手",
      roles: {
        active: {
          description: "用手搔癢對方"
        },
        passive: {
          description: "被對方用手搔癢"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-tickling-axmdvn',
      label: "用梳子",
      roles: {
        active: {
          description: "用梳子搔癢對方"
        },
        passive: {
          description: "被對方用梳子搔癢"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-tickling-10fu930',
      label: "用羽毛",
      roles: {
        active: {
          description: "用羽毛搔癢對方"
        },
        passive: {
          description: "被對方用羽毛搔癢"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-tickling-1hi631w',
      label: "用刺輪",
      roles: {
        active: {
          description: "用刺輪搔癢或刺激對方"
        },
        passive: {
          description: "被對方用刺輪搔癢或刺激"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-tickling-1a2ptfb',
      label: "用震動情趣用品",
      roles: {
        active: {
          description: "用震動情趣用品搔癢或刺激對方"
        },
        passive: {
          description: "被對方用震動情趣用品搔癢或刺激"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-tickling-1uurnpt',
      label: "輕搔",
      roles: {
        active: {
          description: "輕微搔癢對方"
        },
        passive: {
          description: "被對方輕微搔癢"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-tickling-dhntqh',
      label: "重搔",
      roles: {
        active: {
          description: "用較強烈的方式搔癢對方"
        },
        passive: {
          description: "被對方用較強烈的方式搔癢"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-tickling-j94l9q',
      label: "拘束狀態搔癢",
      roles: {
        active: {
          description: "在對方被拘束的狀態下搔癢對方"
        },
        passive: {
          description: "在被拘束的狀態下被對方搔癢"
        }
      },
      warning: "注意恐慌反應、呼吸與無法閃避造成的壓力"
    },
    {
      detailId: 'detail-tickling-1krfcvz',
      label: "裸身搔癢",
      roles: {
        active: {
          description: "在對方裸身狀態下搔癢對方"
        },
        passive: {
          description: "在裸身狀態下被對方搔癢"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-tickling-1nouw8a',
      label: "僅穿內衣褲搔癢",
      roles: {
        active: {
          description: "在對方僅穿內衣褲狀態下搔癢對方"
        },
        passive: {
          description: "在僅穿內衣褲狀態下被對方搔癢"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-tickling-uttpwj',
      label: "穿衣服搔癢",
      roles: {
        active: {
          description: "隔著衣服搔癢對方"
        },
        passive: {
          description: "隔著衣服被對方搔癢"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-tickling-ni7x64',
      label: "搔癢脖子",
      roles: {
        active: {
          description: "搔癢對方的脖子"
        },
        passive: {
          description: "被對方搔癢脖子"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-tickling-11gglre',
      label: "搔癢耳朵",
      roles: {
        active: {
          description: "搔癢對方的耳朵"
        },
        passive: {
          description: "被對方搔癢耳朵"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-tickling-ayd8dk',
      label: "搔癢腋下",
      roles: {
        active: {
          description: "搔癢對方的腋下"
        },
        passive: {
          description: "被對方搔癢腋下"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-tickling-s5eumi',
      label: "搔癢腳底",
      roles: {
        active: {
          description: "搔癢對方的腳底"
        },
        passive: {
          description: "被對方搔癢腳底"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-tickling-cypicd',
      label: "搔癢肋骨間隙",
      roles: {
        active: {
          description: "搔癢對方的肋骨間隙"
        },
        passive: {
          description: "被對方搔癢肋骨間隙"
        }
      },
      warning: null
    }
  ],
  pain_stimulation: [
    {
      detailId: 'detail-pain_stimulation-3jsgcf',
      label: "輕度乳夾",
      roles: {
        active: {
          description: "輕度的用乳夾夾住對方乳頭或乳房"
        },
        passive: {
          description: "被輕度的乳夾夾住乳頭或乳房"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-pain_stimulation-qux8jb',
      label: "重度乳夾",
      roles: {
        active: {
          description: "重度的用乳夾夾住對方乳頭或乳房"
        },
        passive: {
          description: "被重度的乳夾夾住乳頭或乳房"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-pain_stimulation-6cy0m2',
      label: "乳夾並且承重",
      roles: {
        active: {
          description: "讓對方在乳夾上承受重量或拉力"
        },
        passive: {
          description: "在乳夾上承受重量或拉力"
        }
      },
      warning: "注意撕裂傷、血液循環受阻與過度拉扯"
    },
    {
      detailId: 'detail-pain_stimulation-9h5col',
      label: "用手虐乳",
      roles: {
        active: {
          description: "用手揉捏、拉扯或刺激對方乳房造成疼痛"
        },
        passive: {
          description: "被對方用手揉捏、拉扯或刺激乳房造成疼痛"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-pain_stimulation-fg5ey3',
      label: "輕度電擊",
      roles: {
        active: {
          description: "對對方進行輕度電擊刺激"
        },
        passive: {
          description: "接受輕度電擊刺激"
        }
      },
      warning: "避免心臟附近、頭頸部與身體狀況不適者"
    },
    {
      detailId: 'detail-pain_stimulation-rqbs5g',
      label: "較強的電擊",
      roles: {
        active: {
          description: "對對方進行較強的電擊刺激"
        },
        passive: {
          description: "接受較強的電擊刺激"
        }
      },
      warning: "注意心臟風險、肌肉抽動、灼傷與身體不適"
    },
    {
      detailId: 'detail-pain_stimulation-mjdyqb',
      label: "電擊生殖器",
      roles: {
        active: {
          description: "對對方生殖器進行電擊刺激"
        },
        passive: {
          description: "生殖器接受電擊刺激"
        }
      },
      warning: "注意生殖器傷害、灼傷、麻木與身體不適"
    },
    {
      detailId: 'detail-pain_stimulation-565m1l',
      label: "在生殖器周圍姜罰",
      roles: {
        active: {
          description: "對對方生殖器周圍進行姜罰"
        },
        passive: {
          description: "在生殖器周圍接受姜罰"
        }
      },
      warning: "注意皮膚與黏膜刺激、灼熱感與過敏反應"
    },
    {
      detailId: 'detail-pain_stimulation-10b0fb5',
      label: "插入生殖器的姜罰",
      roles: {
        active: {
          description: "對對方進行生殖器插入式姜罰"
        },
        passive: {
          description: "接受生殖器插入式姜罰"
        }
      },
      warning: "注意黏膜損傷、感染風險、灼熱感與身體不適"
    },
    {
      detailId: 'detail-pain_stimulation-145kjnj',
      label: "在肛門周圍姜罰",
      roles: {
        active: {
          description: "對對方肛門周圍進行姜罰"
        },
        passive: {
          description: "在肛門周圍接受姜罰"
        }
      },
      warning: "注意皮膚與黏膜刺激、灼熱感與過敏反應"
    },
    {
      detailId: 'detail-pain_stimulation-10kh2bt',
      label: "插入肛門的姜罰",
      roles: {
        active: {
          description: "對對方進行肛門插入式姜罰"
        },
        passive: {
          description: "接受肛門插入式姜罰"
        }
      },
      warning: "注意黏膜損傷、感染風險、灼熱感與身體不適"
    },
    {
      detailId: 'detail-pain_stimulation-369ag3',
      label: "滴蠟在身體",
      roles: {
        active: {
          description: "將低溫蠟滴在對方身體上造成刺激"
        },
        passive: {
          description: "被滴低溫蠟在身體上造成熱感或疼痛刺激"
        }
      },
      warning: "注意燙傷、皮膚敏感與蠟材溫度"
    },
    {
      detailId: 'detail-pain_stimulation-8lrs4c',
      label: "滴蠟在胸部",
      roles: {
        active: {
          description: "將低溫蠟滴在對方胸部造成刺激"
        },
        passive: {
          description: "被滴低溫蠟在胸部造成刺激"
        }
      },
      warning: "注意燙傷、皮膚敏感與乳頭周圍刺激過強"
    },
    {
      detailId: 'detail-pain_stimulation-j8e4pr',
      label: "滴蠟在生殖器",
      roles: {
        active: {
          description: "將低溫蠟滴在對方生殖器造成刺激"
        },
        passive: {
          description: "被滴低溫蠟在生殖器造成刺激"
        }
      },
      warning: "注意黏膜燙傷、皮膚敏感與感染風險"
    },
    {
      detailId: 'detail-pain_stimulation-1jrzewy',
      label: "輕度咬人/被咬",
      roles: {
        active: {
          description: "輕度咬對方造成疼痛刺激"
        },
        passive: {
          description: "被對方輕度咬造成疼痛刺激"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-pain_stimulation-j9milm',
      label: "重度咬人/被咬",
      roles: {
        active: {
          description: "重度咬對方造成疼痛刺激"
        },
        passive: {
          description: "被對方重度咬造成疼痛刺激"
        }
      },
      warning: "注意皮膚破損、感染風險與傷口照護"
    },
    {
      detailId: 'detail-pain_stimulation-yllz3q',
      label: "拉扯頭髮",
      roles: {
        active: {
          description: "拉扯對方頭髮造成疼痛刺激"
        },
        passive: {
          description: "被對方拉扯頭髮造成疼痛刺激"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-pain_stimulation-151bev7',
      label: "陰唇/陰蒂夾",
      roles: {
        active: {
          description: "用夾具夾住對方陰唇或陰蒂"
        },
        passive: {
          description: "被夾具夾住陰唇或陰蒂"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-pain_stimulation-fdi4gl',
      label: "冰塊刺激",
      roles: {
        active: {
          description: "用冰塊對對方身體進行冷感刺激"
        },
        passive: {
          description: "被對方用冰塊進行冷感刺激"
        }
      },
      warning: "注意凍傷、麻木、體溫與皮膚不適"
    }
  ],
  humiliation: [
    {
      detailId: 'detail-humiliation-ngy4jt',
      label: "搧巴掌",
      roles: {
        active: {
          description: "搧對方巴掌作為羞辱或管教"
        },
        passive: {
          description: "被對方搧巴掌作為羞辱或管教"
        }
      },
      warning: "注意臉部、耳朵、牙齒與頸部受傷風險"
    },
    {
      detailId: 'detail-humiliation-pn03',
      label: "言語羞辱",
      roles: {
        active: {
          description: "用言語貶低、嘲弄或羞辱對方"
        },
        passive: {
          description: "被對方用言語貶低、嘲弄或羞辱"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-humiliation-18rp5a3',
      label: "強迫尿床",
      roles: {
        active: {
          description: "要求對方尿床以造成羞辱感"
        },
        passive: {
          description: "被要求尿床以造成羞辱感"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-humiliation-1podlwa',
      label: "強迫照鏡子",
      roles: {
        active: {
          description: "要求對方照鏡子以造成羞辱感"
        },
        passive: {
          description: "被要求照鏡子以造成羞辱感"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-humiliation-1amvb9e',
      label: "身體寫羞辱字眼",
      roles: {
        active: {
          description: "在對方身體上寫下羞辱字眼"
        },
        passive: {
          description: "身體被寫下羞辱字眼"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-humiliation-1vz66lf',
      label: "剃光頭",
      roles: {
        active: {
          description: "剃除對方頭髮以造成羞辱感"
        },
        passive: {
          description: "被剃除頭髮以造成羞辱感"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-humiliation-1w3livx',
      label: "變裝",
      roles: {
        active: {
          description: "要求對方以變裝作為羞辱情境的一部分"
        },
        passive: {
          description: "被要求以變裝作為羞辱情境的一部分"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-humiliation-1h3yf1m',
      label: "私人場所羞辱",
      roles: {
        active: {
          description: "在私人場所對對方進行羞辱"
        },
        passive: {
          description: "在私人場所被對方羞辱"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-humiliation-ri5nyc',
      label: "公開羞辱",
      roles: {
        active: {
          description: "在公開或可能被他人看見的情境中羞辱對方"
        },
        passive: {
          description: "在公開或可能被他人看見的情境中被羞辱"
        }
      },
      warning: "注意隱私、同意範圍、社會後果與不可逆影響"
    }
  ],
  service: [
    {
      detailId: 'detail-service-7v0tu6',
      label: "腳底按摩",
      roles: {
        active: {
          description: "接受對方為自己按摩腳底"
        },
        passive: {
          description: "為對方按摩腳底"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-service-1rvnr6f',
      label: "全身按摩",
      roles: {
        active: {
          description: "接受對方為自己進行全身按摩"
        },
        passive: {
          description: "為對方進行全身按摩"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-service-1cqhir7',
      label: "準備餐點",
      roles: {
        active: {
          description: "接受對方為自己準備餐點"
        },
        passive: {
          description: "為對方準備餐點"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-service-5cfc80',
      label: "倒茶/飲料",
      roles: {
        active: {
          description: "接受對方為自己倒茶或準備飲料"
        },
        passive: {
          description: "為對方倒茶或準備飲料"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-service-177yx3t',
      label: "提行李/包包",
      roles: {
        active: {
          description: "讓對方替自己提行李或包包"
        },
        passive: {
          description: "替對方提行李或包包"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-service-16nyopw',
      label: "清潔玩具/道具",
      roles: {
        active: {
          description: "讓對方替自己清潔玩具或道具"
        },
        passive: {
          description: "替對方清潔玩具或道具"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-service-176k705',
      label: "做家事",
      roles: {
        active: {
          description: "接受對方為自己做家事"
        },
        passive: {
          description: "為對方做家事"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-service-b75ksu',
      label: "洗澡服侍",
      roles: {
        active: {
          description: "接受對方為自己洗澡或協助清潔身體"
        },
        passive: {
          description: "為對方洗澡或協助清潔身體"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-service-z1q598',
      label: "美甲",
      roles: {
        active: {
          description: "接受對方為自己修剪、保養或裝飾指甲"
        },
        passive: {
          description: "為對方修剪、保養或裝飾指甲"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-service-1nx0nqc',
      label: "載送對方",
      roles: {
        active: {
          description: "讓對方載送自己往返目的地"
        },
        passive: {
          description: "載送對方往返目的地"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-service-15yxo0r',
      label: "性服侍",
      roles: {
        active: {
          description: "接受對方以性行為或性互動服侍自己"
        },
        passive: {
          description: "以性行為或性互動服侍對方"
        }
      },
      warning: null
    }
  ],
  discipline: [
    {
      detailId: 'detail-discipline-11uedoh',
      label: "撰寫日記",
      roles: {
        active: {
          description: "要求對方撰寫日記作為紀錄或回顧"
        },
        passive: {
          description: "被要求撰寫日記作為紀錄或回顧"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-discipline-11sxnh8',
      label: "撰寫實踐心得",
      roles: {
        active: {
          description: "要求對方撰寫實踐心得作為回饋或整理"
        },
        passive: {
          description: "被要求撰寫實踐心得作為回饋或整理"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-discipline-1g2g00r',
      label: "姿勢訓練",
      roles: {
        active: {
          description: "要求對方練習指定姿勢或維持姿勢"
        },
        passive: {
          description: "被要求練習指定姿勢或維持姿勢"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-discipline-qp6v84',
      label: "增肥",
      roles: {
        active: {
          description: "要求對方以增重為目標調整飲食或生活習慣"
        },
        passive: {
          description: "被要求以增重為目標調整飲食或生活習慣"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-discipline-nqdxf9',
      label: "減肥",
      roles: {
        active: {
          description: "要求對方以減重為目標調整飲食或生活習慣"
        },
        passive: {
          description: "被要求以減重為目標調整飲食或生活習慣"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-discipline-18zxvtr',
      label: "飲食控制",
      roles: {
        active: {
          description: "規範或限制對方的飲食內容與飲食方式"
        },
        passive: {
          description: "飲食內容與飲食方式受到對方規範或限制"
        }
      },
      warning: "注意營養不足、健康狀況與控制界線"
    },
    {
      detailId: 'detail-discipline-vrrge7',
      label: "身體檢查",
      roles: {
        active: {
          description: "要求對方接受身體檢查或展示身體狀態"
        },
        passive: {
          description: "被要求接受身體檢查或展示身體狀態"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-discipline-mrnfh0',
      label: "進行對方指定的任務",
      roles: {
        active: {
          description: "指派任務讓對方完成"
        },
        passive: {
          description: "接受對方指派的任務並完成"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-discipline-1h3vvc3',
      label: "對不當的行為訓誡",
      roles: {
        active: {
          description: "針對對方不當的行為進行訓誡或糾正"
        },
        passive: {
          description: "因不當的行為被對方訓誡或糾正"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-discipline-7ki0ex',
      label: "指定學習項目",
      roles: {
        active: {
          description: "指定對方學習特定知識、技能或內容"
        },
        passive: {
          description: "被指定學習特定知識、技能或內容"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-discipline-1686v9k',
      label: "言語規範",
      roles: {
        active: {
          description: "規範對方的用語、稱呼或說話方式"
        },
        passive: {
          description: "用語、稱呼或說話方式受到對方規範"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-discipline-s0l9h0',
      label: "制定/執行儀式",
      roles: {
        active: {
          description: "制定並要求對方執行特定儀式"
        },
        passive: {
          description: "被要求執行對方制定的特定儀式"
        }
      },
      warning: null
    }
  ],
  sexual_interaction: [
    {
      detailId: 'detail-sexual_interaction-ln7hc7',
      label: "性交",
      roles: {
        active: {
          description: "在性交中擔任主導側"
        },
        passive: {
          description: "在性交中擔任配合側"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-sexual_interaction-1aef53n',
      label: "口交",
      roles: {
        active: {
          description: "在口交中擔任主導側"
        },
        passive: {
          description: "在口交中擔任配合側"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-sexual_interaction-1ytloln',
      label: "肛交",
      roles: {
        active: {
          description: "在肛交中擔任主導側"
        },
        passive: {
          description: "在肛交中擔任配合側"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-sexual_interaction-wc6vs3',
      label: "乳交",
      roles: {
        active: {
          description: "在乳交中擔任主導側"
        },
        passive: {
          description: "在乳交中擔任配合側"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-sexual_interaction-1k4ddkr',
      label: "手交",
      roles: {
        active: {
          description: "用手刺激對方生殖器"
        },
        passive: {
          description: "接受對方用手刺激生殖器"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-sexual_interaction-1g5pujn',
      label: "拳交",
      roles: {
        active: {
          description: "對對方進行拳交"
        },
        passive: {
          description: "接受對方拳交"
        }
      },
      warning: "注意撕裂傷、出血、感染風險與身體不適"
    },
    {
      detailId: 'detail-sexual_interaction-filrqn',
      label: "射精於嘴內",
      roles: {
        active: {
          description: "射精在對方嘴內"
        },
        passive: {
          description: "被射精在嘴內"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-sexual_interaction-1rt5tu9',
      label: "射精於臉上",
      roles: {
        active: {
          description: "射精在對方臉上"
        },
        passive: {
          description: "被射精在臉上"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-sexual_interaction-1ue4af6',
      label: "射精於胸部",
      roles: {
        active: {
          description: "射精在對方胸部"
        },
        passive: {
          description: "被射精在胸部"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-sexual_interaction-tvmpfz',
      label: "射精於陰道",
      roles: {
        active: {
          description: "射精在對方陰道內"
        },
        passive: {
          description: "被射精在陰道內"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-sexual_interaction-dsyi29',
      label: "射精於肛門",
      roles: {
        active: {
          description: "射精在對方肛門內或肛門周圍"
        },
        passive: {
          description: "被射精在肛門內或肛門周圍"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-sexual_interaction-29csl5',
      label: "射精於頭髮",
      roles: {
        active: {
          description: "射精在對方頭髮上"
        },
        passive: {
          description: "被射精在頭髮上"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-sexual_interaction-qk9oti',
      label: "吞精液",
      roles: {
        active: {
          description: "要求對方吞下精液"
        },
        passive: {
          description: "吞下對方精液"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-sexual_interaction-ik3j9u',
      label: "吃含精液的食物",
      roles: {
        active: {
          description: "讓對方食用含有精液的食物"
        },
        passive: {
          description: "食用含有精液的食物"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-sexual_interaction-jfpa5h',
      label: "潮吹",
      roles: {
        active: {
          description: "讓對方潮吹或引導對方潮吹"
        },
        passive: {
          description: "被對方引導或刺激到潮吹"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-sexual_interaction-8jcyoj',
      label: "強制高潮",
      roles: {
        active: {
          description: "持續刺激對方直到高潮或多次高潮"
        },
        passive: {
          description: "被對方持續刺激直到高潮或多次高潮"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-sexual_interaction-w99mgx',
      label: "自慰展示",
      roles: {
        active: {
          description: "要求對方展示自慰"
        },
        passive: {
          description: "被要求展示自慰"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-sexual_interaction-1sl20mr',
      label: "用性玩具服務",
      roles: {
        active: {
          description: "用性玩具刺激對方"
        },
        passive: {
          description: "被對方用性玩具刺激"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-sexual_interaction-1xo6keo',
      label: "尿道棒調教",
      roles: {
        active: {
          description: "對對方進行尿道棒調教"
        },
        passive: {
          description: "接受對方進行尿道棒調教"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-sexual_interaction-6pp140',
      label: "交與跳蛋操作權",
      roles: {
        active: {
          description: "取得並控制對方的跳蛋操作權"
        },
        passive: {
          description: "將跳蛋操作權交給對方控制"
        }
      },
      warning: "注意場合、強度、身體不適與停止方式"
    },
    {
      detailId: 'detail-sexual_interaction-flhbf2',
      label: "於公共場所穿戴跳蛋",
      roles: {
        active: {
          description: "要求對方在公共場所穿戴跳蛋"
        },
        passive: {
          description: "在公共場所穿戴由對方控制或指定的跳蛋"
        }
      },
      warning: "注意隱私、身分暴露、公共場合界線與停止方式"
    }
  ],
  anal_interaction: [
    {
      detailId: 'detail-anal_interaction-1oupd9i',
      label: "直徑小於三公分的肛塞",
      roles: {
        active: {
          description: "讓對方放入直徑小於三公分的肛塞"
        },
        passive: {
          description: "被放入直徑小於三公分的肛塞"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-anal_interaction-1m59dfi',
      label: "直徑介於三到五公分的肛塞",
      roles: {
        active: {
          description: "讓對方放入直徑介於三到五公分的肛塞"
        },
        passive: {
          description: "被放入直徑介於三到五公分的肛塞"
        }
      },
      warning: "注意潤滑、撕裂傷、尺寸適應與身體不適"
    },
    {
      detailId: 'detail-anal_interaction-b8y6xr',
      label: "直徑大於五公分的肛塞",
      roles: {
        active: {
          description: "讓對方放入直徑大於五公分的肛塞"
        },
        passive: {
          description: "被放入直徑大於五公分的肛塞"
        }
      },
      warning: "注意撕裂傷、出血、括約肌傷害與身體不適"
    },
    {
      detailId: 'detail-anal_interaction-1sgm90w',
      label: "肛鞭",
      roles: {
        active: {
          description: "用肛鞭刺激對方肛門"
        },
        passive: {
          description: "被對方用肛鞭刺激肛門"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-anal_interaction-4g0x9i',
      label: "串珠情趣玩具",
      roles: {
        active: {
          description: "用串珠情趣玩具刺激對方肛門"
        },
        passive: {
          description: "被對方用串珠情趣玩具刺激肛門"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-anal_interaction-ilmux2',
      label: "擴肛訓練",
      roles: {
        active: {
          description: "引導對方進行擴肛訓練"
        },
        passive: {
          description: "接受對方引導進行擴肛訓練"
        }
      },
      warning: "注意循序漸進、潤滑、撕裂傷與身體不適"
    },
    {
      detailId: 'detail-anal_interaction-n69t3o',
      label: "肛門擴張器",
      roles: {
        active: {
          description: "用肛門擴張器擴張對方肛門"
        },
        passive: {
          description: "被對方用肛門擴張器擴張肛門"
        }
      },
      warning: "注意尺寸、潤滑、撕裂傷與出血"
    },
    {
      detailId: 'detail-anal_interaction-v6v9dp',
      label: "肛門窺器",
      roles: {
        active: {
          description: "用肛門窺器撐開或觀察對方肛門"
        },
        passive: {
          description: "被對方用肛門窺器撐開或觀察肛門"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-anal_interaction-12ghyy9',
      label: "被灌腸",
      roles: {
        active: {
          description: "為對方進行灌腸"
        },
        passive: {
          description: "接受對方灌腸"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-anal_interaction-gwnjaf',
      label: "舔肛服務",
      roles: {
        active: {
          description: "接受對方舔肛服務"
        },
        passive: {
          description: "為對方提供舔肛服務"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-anal_interaction-1wf7u60',
      label: "一小時內穿戴肛塞",
      roles: {
        active: {
          description: "要求對方穿戴肛塞一小時內"
        },
        passive: {
          description: "穿戴肛塞一小時內"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-anal_interaction-19jmdrg',
      label: "一到三小時穿戴肛塞",
      roles: {
        active: {
          description: "要求對方穿戴肛塞一到三小時"
        },
        passive: {
          description: "穿戴肛塞一到三小時"
        }
      },
      warning: "注意長時間壓迫、潤滑不足與身體不適"
    },
    {
      detailId: 'detail-anal_interaction-ww1hfr',
      label: "三小時以上穿戴肛塞",
      roles: {
        active: {
          description: "要求對方穿戴肛塞三小時以上"
        },
        passive: {
          description: "穿戴肛塞三小時以上"
        }
      },
      warning: "注意長時間壓迫、黏膜刺激、取出困難與身體不適"
    },
    {
      detailId: 'detail-anal_interaction-npcnih',
      label: "睡覺時穿戴肛塞",
      roles: {
        active: {
          description: "要求對方睡覺時穿戴肛塞"
        },
        passive: {
          description: "睡覺時穿戴肛塞"
        }
      },
      warning: "注意長時間壓迫、睡眠中不適與緊急取出困難"
    },
    {
      detailId: 'detail-anal_interaction-1c35d5h',
      label: "於公共場所穿戴肛塞",
      roles: {
        active: {
          description: "要求對方在公共場所穿戴肛塞"
        },
        passive: {
          description: "在公共場所穿戴肛塞"
        }
      },
      warning: "注意隱私、身分暴露、身體不適與取出方式"
    }
  ],
  multi_party_interaction: [
    {
      detailId: 'detail-multi_party_interaction-jy04v5',
      label: "一主多奴/寵",
      roles: {
        active: {
          description: "在一主多奴/寵關係中擔任主導側"
        },
        passive: {
          description: "在一主多奴/寵關係中擔任奴方或寵物方"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-multi_party_interaction-1retpvp',
      label: "多主一奴/寵",
      roles: {
        active: {
          description: "在多主一奴/寵關係中擔任主導側之一"
        },
        passive: {
          description: "在多主一奴/寵關係中擔任奴方或寵物方"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-multi_party_interaction-14o4ip9',
      label: "交換伴侶",
      roles: {
        active: {
          description: "與他人交換伴侶進行互動或性互動"
        },
        passive: {
          description: "在伴侶交換情境中與他人互動或性互動"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-multi_party_interaction-rrbnk5',
      label: "綠帽遊戲",
      roles: {
        active: {
          description: "安排或引導對方經歷綠帽情境"
        },
        passive: {
          description: "在綠帽情境中被安排、觀看或參與"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-multi_party_interaction-2wnhye',
      label: "群交",
      roles: {
        active: {
          description: "參與或安排多人性互動"
        },
        passive: {
          description: "參與多人性互動"
        }
      },
      warning: "注意所有參與者同意、性病風險、避孕與界線管理"
    },
    {
      detailId: 'detail-multi_party_interaction-1rwzxqq',
      label: "知情同意下的輪姦",
      roles: {
        active: {
          description: "安排多人在知情同意下對對方進行輪姦情境"
        },
        passive: {
          description: "在知情同意下接受多人輪姦情境"
        }
      },
      warning: "注意明確同意、停止方式、身體安全與創傷觸發"
    },
    {
      detailId: 'detail-multi_party_interaction-1p23a5n',
      label: "短期分享/交予給第三人",
      roles: {
        active: {
          description: "短期將對方分享或交予第三人互動"
        },
        passive: {
          description: "短期被分享或交予第三人互動"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-multi_party_interaction-18qgi5',
      label: "長期分享/交予給第三人",
      roles: {
        active: {
          description: "長期將對方分享或交予第三人互動"
        },
        passive: {
          description: "長期被分享或交予第三人互動"
        }
      },
      warning: "注意關係權責、生活影響、同意更新與退出方式"
    },
    {
      detailId: 'detail-multi_party_interaction-8rm4og',
      label: "特定情況分享/交予給第三人",
      roles: {
        active: {
          description: "在特定情況下將對方分享或交予第三人互動"
        },
        passive: {
          description: "在特定情況下被分享或交予第三人互動"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-multi_party_interaction-rxs1rf',
      label: "多人約會",
      roles: {
        active: {
          description: "安排或參與多人約會情境"
        },
        passive: {
          description: "參與多人約會情境"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-multi_party_interaction-1ovw0ci',
      label: "多人調教",
      roles: {
        active: {
          description: "安排或參與多人調教情境"
        },
        passive: {
          description: "參與多人調教情境"
        }
      },
      warning: null
    }
  ],
  enslavement: [
    {
      detailId: 'detail-enslavement-bei8uo',
      label: "性奴",
      roles: {
        active: {
          description: "讓對方在合意情境中扮演性奴角色"
        },
        passive: {
          description: "在合意情境中扮演性奴角色"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-enslavement-1lnxc6o',
      label: "家事奴",
      roles: {
        active: {
          description: "讓對方在合意情境中扮演家事奴角色"
        },
        passive: {
          description: "在合意情境中扮演家事奴角色"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-enslavement-emvul7',
      label: "服侍奴",
      roles: {
        active: {
          description: "讓對方在合意情境中扮演服侍奴角色"
        },
        passive: {
          description: "在合意情境中扮演服侍奴角色"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-enslavement-5p38rr',
      label: "ATM奴",
      roles: {
        active: {
          description: "讓對方在合意情境中扮演金錢供給或付款角色"
        },
        passive: {
          description: "在合意情境中扮演金錢供給或付款角色"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-enslavement-ktgyn6',
      label: "司機奴",
      roles: {
        active: {
          description: "讓對方在合意情境中扮演接送或駕駛服務角色"
        },
        passive: {
          description: "在合意情境中扮演接送或駕駛服務角色"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-enslavement-8hpgnn',
      label: "疼痛奴/出氣包",
      roles: {
        active: {
          description: "讓對方在合意情境中扮演承受疼痛或出氣包角色"
        },
        passive: {
          description: "在合意情境中扮演承受疼痛或出氣包角色"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-enslavement-p5y68w',
      label: "奴隸訓練",
      roles: {
        active: {
          description: "對對方進行奴隸角色相關訓練"
        },
        passive: {
          description: "接受奴隸角色相關訓練"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-enslavement-8sl7b1',
      label: "給予/擁有奴隸項圈",
      roles: {
        active: {
          description: "給予對方奴隸項圈或象徵"
        },
        passive: {
          description: "接受對方給予奴隸項圈或象徵"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-enslavement-wgiuuj',
      label: "私人空間牽繩牽引",
      roles: {
        active: {
          description: "在私人空間以牽繩牽引對方"
        },
        passive: {
          description: "在私人空間被對方以牽繩牽引"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-enslavement-1654r6x',
      label: "公開空間牽繩牽引",
      roles: {
        active: {
          description: "在公開空間以牽繩牽引對方"
        },
        passive: {
          description: "在公開空間被對方以牽繩牽引"
        }
      },
      warning: "注意身分暴露、他人同意、公共場合界線與安全風險"
    },
    {
      detailId: 'detail-enslavement-w3wrxl',
      label: "關奴隸籠子",
      roles: {
        active: {
          description: "將對方關入奴隸籠子或限制在籠內"
        },
        passive: {
          description: "被關入奴隸籠子或限制在籠內"
        }
      },
      warning: "注意姿勢壓迫、恐慌反應、通風與緊急解放方式"
    },
    {
      detailId: 'detail-enslavement-1d5ybf5',
      label: "短暫奴化",
      roles: {
        active: {
          description: "讓對方短暫進入奴化角色或狀態"
        },
        passive: {
          description: "短暫進入奴化角色或狀態"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-enslavement-tu6x63',
      label: "長期奴化",
      roles: {
        active: {
          description: "讓對方長期維持奴化角色或狀態"
        },
        passive: {
          description: "長期維持奴化角色或狀態"
        }
      },
      warning: "注意現實生活影響、身分界線、同意更新與退出方式"
    },
    {
      detailId: 'detail-enslavement-swx1g2',
      label: "永久奴化",
      roles: {
        active: {
          description: "讓對方進入永久奴化的關係設定"
        },
        passive: {
          description: "進入永久奴化的關係設定"
        }
      },
      warning: "注意長期心理影響、現實法律限制、同意更新與退出方式"
    }
  ],
  pet_play: [
    {
      detailId: 'detail-pet_play-1jsyyjh',
      label: "幫寵物洗澡/梳毛",
      roles: {
        active: {
          description: "為扮演寵物的對方洗澡或梳毛"
        },
        passive: {
          description: "在寵物角色中接受對方洗澡或梳毛"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-pet_play-a609w4',
      label: "玩寵物玩具",
      roles: {
        active: {
          description: "拿寵物玩具與扮演寵物的對方互動"
        },
        passive: {
          description: "在寵物角色中與對方玩寵物玩具"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-pet_play-x5vjdy',
      label: "四肢爬行",
      roles: {
        active: {
          description: "要求對方以四肢爬行方式扮演獸或寵物"
        },
        passive: {
          description: "以四肢爬行方式扮演獸或寵物"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-pet_play-nv1pij',
      label: "發出獸/寵物叫",
      roles: {
        active: {
          description: "要求對方發出獸或寵物叫聲"
        },
        passive: {
          description: "發出獸或寵物叫聲扮演獸或寵物"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-pet_play-rvrxgu',
      label: "寵物碗餵食人類食物",
      roles: {
        active: {
          description: "用寵物碗餵食對方人類食物"
        },
        passive: {
          description: "用寵物碗進食人類食物"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-pet_play-4bs8mo',
      label: "寵物碗餵食寵物濕食",
      roles: {
        active: {
          description: "用寵物碗餵食對方寵物濕食"
        },
        passive: {
          description: "用寵物碗進食寵物濕食"
        }
      },
      warning: "注意食品安全、腸胃不適、過敏與衛生"
    },
    {
      detailId: 'detail-pet_play-1hw29un',
      label: "寵物碗餵食寵物乾食",
      roles: {
        active: {
          description: "用寵物碗餵食對方寵物乾食"
        },
        passive: {
          description: "用寵物碗進食寵物乾食"
        }
      },
      warning: "注意食品安全、噎到、腸胃不適與衛生"
    },
    {
      detailId: 'detail-pet_play-etd5x1',
      label: "寵物技能訓練",
      roles: {
        active: {
          description: "訓練對方完成寵物角色中的指定技能"
        },
        passive: {
          description: "接受對方訓練並完成寵物角色中的指定技能"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-pet_play-52x52j',
      label: "給予/擁有寵物項圈",
      roles: {
        active: {
          description: "給予對方寵物項圈或象徵"
        },
        passive: {
          description: "接受對方給予寵物項圈或象徵"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-pet_play-ljh0h7',
      label: "私人空間牽繩牽引",
      roles: {
        active: {
          description: "在私人空間以牽繩牽引扮演寵物的對方"
        },
        passive: {
          description: "在私人空間被對方以牽繩牽引"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-pet_play-1efmrop',
      label: "公開空間牽繩牽引",
      roles: {
        active: {
          description: "在公開空間以牽繩牽引扮演寵物的對方"
        },
        passive: {
          description: "在公開空間被對方以牽繩牽引"
        }
      },
      warning: "注意身分暴露、他人同意、公共場合界線與安全風險"
    },
    {
      detailId: 'detail-pet_play-iua2gj',
      label: "關寵物籠子",
      roles: {
        active: {
          description: "將扮演寵物的對方關入或限制在寵物籠內"
        },
        passive: {
          description: "在寵物角色中被關入或限制在寵物籠內"
        }
      },
      warning: "注意姿勢壓迫、恐慌反應、通風與緊急解放方式"
    },
    {
      detailId: 'detail-pet_play-1hdeo81',
      label: "穿戴寵物髮飾/尾巴",
      roles: {
        active: {
          description: "要求對方穿戴寵物髮飾或尾巴"
        },
        passive: {
          description: "穿戴寵物髮飾或尾巴扮演寵物"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-pet_play-jkh6sm',
      label: "短暫獸/寵物化",
      roles: {
        active: {
          description: "讓對方短暫進入獸或寵物角色"
        },
        passive: {
          description: "短暫進入獸或寵物角色"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-pet_play-1o3a8sg',
      label: "長期獸/寵物化",
      roles: {
        active: {
          description: "讓對方長期維持獸或寵物角色"
        },
        passive: {
          description: "長期維持獸或寵物角色"
        }
      },
      warning: "注意現實生活影響、身分界線、同意更新與退出方式"
    },
    {
      detailId: 'detail-pet_play-7xqowr',
      label: "永久獸/寵物化",
      roles: {
        active: {
          description: "讓對方進入永久獸或寵物化的關係設定"
        },
        passive: {
          description: "進入永久獸或寵物化的關係設定"
        }
      },
      warning: "注意長期心理影響、現實法律限制、同意更新與退出方式"
    }
  ],
  role_play: [
    {
      detailId: 'detail-role_play-j6rqh7',
      label: "扮演小寶寶",
      roles: {
        active: {
          description: "讓對方扮演小寶寶"
        },
        passive: {
          description: "在對方面前扮演小寶寶"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-role_play-1hqqab2',
      label: "扮演小孩",
      roles: {
        active: {
          description: "讓對方扮演小孩"
        },
        passive: {
          description: "在對方面前扮演小孩"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-role_play-1b6vck1',
      label: "扮演青少年",
      roles: {
        active: {
          description: "讓對方扮演青少年"
        },
        passive: {
          description: "在對方面前扮演青少年"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-role_play-1bf86f7',
      label: "扮演老年人",
      roles: {
        active: {
          description: "讓對方扮演老年人"
        },
        passive: {
          description: "在對方面前扮演老年人"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-role_play-1qg4s3q',
      label: "扮演人偶或娃娃",
      roles: {
        active: {
          description: "讓對方扮演人偶或娃娃"
        },
        passive: {
          description: "在對方面前扮演人偶或娃娃"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-role_play-1i9t0en',
      label: "扮演主僕腳色",
      roles: {
        active: {
          description: "在貴族僕役情境中扮演主導側"
        },
        passive: {
          description: "在貴族僕役情境中扮演配合側"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-role_play-1n9uevy',
      label: "扮演上司/下屬",
      roles: {
        active: {
          description: "在上司和下屬的情境中扮演主導側"
        },
        passive: {
          description: "在上司和下屬的情境中扮演配合側"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-role_play-kodrud',
      label: "扮演醫生或護士/病患",
      roles: {
        active: {
          description: "在醫護和病患的情境中扮演主導側"
        },
        passive: {
          description: "在醫護和病患的情境中扮演配合側"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-role_play-1gts3i7',
      label: "扮演獄卒/服刑人",
      roles: {
        active: {
          description: "在獄卒和服刑人的情境中扮演主導側"
        },
        passive: {
          description: "在獄卒和服刑人的情境中扮演配合側"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-role_play-vepd7q',
      label: "扮演老師/學生",
      roles: {
        active: {
          description: "在老師和學生的情境中扮演主導側"
        },
        passive: {
          description: "在老師和學生的情境中扮演配合側"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-role_play-1virdb',
      label: "扮演父母/兒女",
      roles: {
        active: {
          description: "在父母和兒女的情境中扮演主導側"
        },
        passive: {
          description: "在父母和兒女的情境中扮演配合側"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-role_play-18ycvwm',
      label: "扮演兄弟姊妹",
      roles: {
        active: {
          description: "在兄弟姊妹的情境中扮演主導側"
        },
        passive: {
          description: "在兄弟姊妹的情境中扮演配合側"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-role_play-pyo1lh',
      label: "包尿布",
      roles: {
        active: {
          description: "讓對方包尿布"
        },
        passive: {
          description: "在對方面前包尿布"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-role_play-u5m4ic',
      label: "塗鴉遊戲",
      roles: {
        active: {
          description: "在對方身體或物品上塗鴉"
        },
        passive: {
          description: "讓對方在自己身體或物品上塗鴉"
        }
      },
      warning: null
    }
  ],
  objectification: [
    {
      detailId: 'detail-objectification-1l6nra5',
      label: "作為椅子",
      roles: {
        active: {
          description: "把對方當作椅子使用"
        },
        passive: {
          description: "被對方當作椅子使用"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-objectification-1nqioit',
      label: "作為沙發",
      roles: {
        active: {
          description: "把對方當作沙發使用"
        },
        passive: {
          description: "被對方當作沙發使用"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-objectification-6z8u5c',
      label: "作為踏腳墊",
      roles: {
        active: {
          description: "把對方當作踏腳墊使用"
        },
        passive: {
          description: "被對方當作踏腳墊使用"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-objectification-gmtfv3',
      label: "作為花瓶",
      roles: {
        active: {
          description: "把對方當作花瓶展示"
        },
        passive: {
          description: "被對方當作花瓶展示"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-objectification-1xfrg59',
      label: "作為衣架",
      roles: {
        active: {
          description: "把對方當作衣架使用"
        },
        passive: {
          description: "被對方當作衣架使用"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-objectification-11fzq08',
      label: "作為人偶",
      roles: {
        active: {
          description: "把對方當作人偶擺放或展示"
        },
        passive: {
          description: "被對方當作人偶擺放或展示"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-objectification-ydg8ls',
      label: "作為菸灰缸",
      roles: {
        active: {
          description: "把對方當作菸灰缸使用"
        },
        passive: {
          description: "被對方當作菸灰缸使用"
        }
      },
      warning: "注意燙傷、菸灰接觸、衛生與呼吸道不適"
    },
    {
      detailId: 'detail-objectification-15peili',
      label: "作為食物盤子/碗",
      roles: {
        active: {
          description: "把對方身體當作食物盤子或碗使用"
        },
        passive: {
          description: "身體被當作食物盤子或碗使用"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-objectification-18d3dxj',
      label: "作為自慰套",
      roles: {
        active: {
          description: "把對方當作自慰套使用"
        },
        passive: {
          description: "被對方當作自慰套使用"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-objectification-gg0tot',
      label: "作為假陽具",
      roles: {
        active: {
          description: "把對方當作假陽具使用"
        },
        passive: {
          description: "被對方當作假陽具使用"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-objectification-11y1b4u',
      label: "作為交易用資產",
      roles: {
        active: {
          description: "把對方設定為可交易或交換的資產"
        },
        passive: {
          description: "被設定為可交易或交換的資產"
        }
      },
      warning: "注意人格界線、現實法律限制、同意範圍與退出方式"
    }
  ],
  exposure: [
    {
      detailId: 'detail-exposure-yrd6oh',
      label: "在對方面前暴露",
      roles: {
        active: {
          description: "要求對方在自己面前暴露身體"
        },
        passive: {
          description: "在對方面前暴露身體"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-exposure-84q67p',
      label: "在朋友面前暴露",
      roles: {
        active: {
          description: "要求對方在朋友面前暴露身體"
        },
        passive: {
          description: "在朋友面前暴露身體"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-exposure-1c953fq',
      label: "在陌生人面前暴露",
      roles: {
        active: {
          description: "要求對方在陌生人面前暴露身體"
        },
        passive: {
          description: "在陌生人面前暴露身體"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-exposure-cf5jn6',
      label: "在私人空間暴露",
      roles: {
        active: {
          description: "要求對方在私人空間暴露身體"
        },
        passive: {
          description: "在私人空間暴露身體"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-exposure-jg19zi',
      label: "在公共空間暴露",
      roles: {
        active: {
          description: "要求對方在公共空間暴露身體"
        },
        passive: {
          description: "在公共空間暴露身體"
        }
      },
      warning: "注意非參與者同意、法律風險、身分暴露與安全"
    },
    {
      detailId: 'detail-exposure-14ngx9f',
      label: "觀賞/被觀賞性愛過程",
      roles: {
        active: {
          description: "觀看他人的性愛過程"
        },
        passive: {
          description: "讓他人觀看自己的性愛過程"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-exposure-iztub',
      label: "上半身暴露",
      roles: {
        active: {
          description: "要求對方暴露上半身"
        },
        passive: {
          description: "暴露上半身給對方觀看"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-exposure-lc5lxg',
      label: "下半身暴露",
      roles: {
        active: {
          description: "要求對方暴露下半身"
        },
        passive: {
          description: "暴露下半身給對方觀看"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-exposure-rhnyao',
      label: "外出不穿內衣褲",
      roles: {
        active: {
          description: "要求對方外出時不穿內衣褲"
        },
        passive: {
          description: "外出時不穿內衣褲"
        }
      },
      warning: "注意舒適度、衛生、身分暴露與公共場合風險"
    },
    {
      detailId: 'detail-exposure-1on1gyu',
      label: "在公共空間自慰",
      roles: {
        active: {
          description: "要求對方在公共空間自慰"
        },
        passive: {
          description: "在公共空間自慰"
        }
      },
      warning: "注意非參與者同意、法律風險、身分暴露與安全"
    }
  ],
  image_recording: [
    {
      detailId: 'detail-image_recording-wr9mg2',
      label: "拍攝/錄製裸體",
      roles: {
        active: {
          description: "拍攝或錄製對方裸體"
        },
        passive: {
          description: "被拍攝或錄製裸體"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-image_recording-pottfn',
      label: "拍攝/錄製性愛過程",
      roles: {
        active: {
          description: "拍攝或錄製對方性愛過程"
        },
        passive: {
          description: "性愛過程被拍攝或錄製"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-image_recording-ijadox',
      label: "拍攝/錄製調教過程",
      roles: {
        active: {
          description: "拍攝或錄製對方調教過程"
        },
        passive: {
          description: "調教過程被拍攝或錄製"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-image_recording-xuxzia',
      label: "傳送私密影像/影片",
      roles: {
        active: {
          description: "要求對方傳送私密影像或影片"
        },
        passive: {
          description: "傳送自己的私密影像或影片"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-image_recording-1c6bdpw',
      label: "在網路公開私密影像/影片",
      roles: {
        active: {
          description: "將對方私密影像或影片公開到網路"
        },
        passive: {
          description: "自己的私密影像或影片被公開到網路"
        }
      },
      warning: "注意不可逆外流、平台規範、身分暴露與法律風險"
    },
    {
      detailId: 'detail-image_recording-1942hqe',
      label: "用對方的私密影像/應片自慰",
      roles: {
        active: {
          description: "使用對方私密影像或影片自慰"
        },
        passive: {
          description: "自己的私密影像或影片被對方用於自慰"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-image_recording-1ie3kyu',
      label: "用配合側的裝置拍攝",
      roles: {
        active: {
          description: "用配合側的裝置拍攝私密影像或影片"
        },
        passive: {
          description: "自己的裝置被用來拍攝私密影像或影片"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-image_recording-r9zfxi',
      label: "用主導側的裝置拍攝",
      roles: {
        active: {
          description: "用自己的裝置拍攝對方私密影像或影片"
        },
        passive: {
          description: "被對方用其裝置拍攝私密影像或影片"
        }
      },
      warning: "注意保存權限、裝置安全、外流風險與刪除約定"
    },
    {
      detailId: 'detail-image_recording-16hzzoq',
      label: "製作身體影像歷程紀錄",
      roles: {
        active: {
          description: "為對方製作身體影像歷程紀錄"
        },
        passive: {
          description: "被製作身體影像歷程紀錄"
        }
      },
      warning: null
    }
  ],
  piercing_cutting: [
    {
      detailId: 'detail-piercing_cutting-1rw9xzg',
      label: "作為裝飾的身體穿刺",
      roles: {
        active: {
          description: "為對方進行裝飾性的身體穿刺"
        },
        passive: {
          description: "接受裝飾性的身體穿刺"
        }
      },
      warning: "注意消毒、感染、過敏、疤痕與專業操作"
    },
    {
      detailId: 'detail-piercing_cutting-2ewqgb',
      label: "作為刺激的身體穿刺",
      roles: {
        active: {
          description: "為對方進行刺激性的身體穿刺"
        },
        passive: {
          description: "接受刺激性的身體穿刺"
        }
      },
      warning: "注意消毒、感染、出血、疼痛與身體不適"
    },
    {
      detailId: 'detail-piercing_cutting-ypns2e',
      label: "穿刺後承重",
      roles: {
        active: {
          description: "讓對方在穿刺處承受重量或拉力"
        },
        passive: {
          description: "在穿刺處承受重量或拉力"
        }
      },
      warning: "注意撕裂傷、出血、感染與過度拉扯"
    },
    {
      detailId: 'detail-piercing_cutting-1jvq8gi',
      label: "暫時穿孔/環",
      roles: {
        active: {
          description: "為對方進行暫時穿孔或穿環"
        },
        passive: {
          description: "接受暫時穿孔或穿環"
        }
      },
      warning: "注意消毒、感染、出血與傷口照護"
    },
    {
      detailId: 'detail-piercing_cutting-rdg71s',
      label: "永久穿孔/環",
      roles: {
        active: {
          description: "為對方進行永久穿孔或穿環"
        },
        passive: {
          description: "接受永久穿孔或穿環"
        }
      },
      warning: "注意永久身體改變、疤痕、感染與後續照護"
    },
    {
      detailId: 'detail-piercing_cutting-5uq5u0',
      label: "乳環",
      roles: {
        active: {
          description: "為對方進行乳環穿刺或配戴"
        },
        passive: {
          description: "接受乳環穿刺或配戴"
        }
      },
      warning: "注意感染、撕裂、血液循環與乳頭敏感"
    },
    {
      detailId: 'detail-piercing_cutting-rxxg5l',
      label: "肚環",
      roles: {
        active: {
          description: "為對方進行肚環穿刺或配戴"
        },
        passive: {
          description: "接受肚環穿刺或配戴"
        }
      },
      warning: "注意感染、過敏、衣物摩擦與傷口照護"
    },
    {
      detailId: 'detail-piercing_cutting-az913p',
      label: "生殖器穿環",
      roles: {
        active: {
          description: "為對方進行生殖器穿環"
        },
        passive: {
          description: "接受生殖器穿環"
        }
      },
      warning: "注意感染、出血、性功能影響與專業操作"
    },
    {
      detailId: 'detail-piercing_cutting-1rewigf',
      label: "舌環",
      roles: {
        active: {
          description: "為對方進行舌環穿刺或配戴"
        },
        passive: {
          description: "接受舌環穿刺或配戴"
        }
      },
      warning: "注意腫脹、感染、牙齒損傷與吞嚥不適"
    },
    {
      detailId: 'detail-piercing_cutting-1fkp3oe',
      label: "不流血程度的割/切",
      roles: {
        active: {
          description: "對對方進行不流血程度的割或切"
        },
        passive: {
          description: "接受不流血程度的割或切"
        }
      },
      warning: "注意皮膚損傷、消毒、疼痛與疤痕"
    },
    {
      detailId: 'detail-piercing_cutting-126gchb',
      label: "流血程度的割/切",
      roles: {
        active: {
          description: "對對方進行流血程度的割或切"
        },
        passive: {
          description: "接受流血程度的割或切"
        }
      },
      warning: "注意出血、感染、疤痕、傷口照護與醫療風險"
    }
  ],
  excretion: [
    {
      detailId: 'detail-excretion-10mgbv7',
      label: "在身體上淋尿",
      roles: {
        active: {
          description: "在對方身體上淋尿"
        },
        passive: {
          description: "被對方在身體上淋尿"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-excretion-18pmjci',
      label: "在頭部以上淋尿",
      roles: {
        active: {
          description: "在對方頭部以上淋尿"
        },
        passive: {
          description: "被對方在頭部以上淋尿"
        }
      },
      warning: "注意眼睛、口鼻、耳道、衛生與心理壓力"
    },
    {
      detailId: 'detail-excretion-d0tfsd',
      label: "飲尿",
      roles: {
        active: {
          description: "要求對方飲尿"
        },
        passive: {
          description: "飲用對方尿液"
        }
      },
      warning: "注意感染風險、身體不適、衛生與心理界線"
    },
    {
      detailId: 'detail-excretion-bz8baf',
      label: "碰觸排泄物",
      roles: {
        active: {
          description: "要求對方碰觸排泄物"
        },
        passive: {
          description: "碰觸對方或自己的排泄物"
        }
      },
      warning: "注意感染風險、皮膚接觸、清潔與心理壓力"
    },
    {
      detailId: 'detail-excretion-1d9pfly',
      label: "食用排泄物",
      roles: {
        active: {
          description: "要求對方食用排泄物"
        },
        passive: {
          description: "食用對方或自己的排泄物"
        }
      },
      warning: "注意嚴重感染、腸胃不適、衛生與醫療風險"
    },
    {
      detailId: 'detail-excretion-1x972yx',
      label: "用排泄物自慰",
      roles: {
        active: {
          description: "要求對方用排泄物自慰"
        },
        passive: {
          description: "使用排泄物自慰"
        }
      },
      warning: "注意黏膜感染、皮膚刺激、清潔與醫療風險"
    },
    {
      detailId: 'detail-excretion-4yx1it',
      label: "扮演尿壺",
      roles: {
        active: {
          description: "讓對方扮演尿壺"
        },
        passive: {
          description: "扮演尿壺接受對方使用"
        }
      },
      warning: "注意衛生、身體位置、清理與心理界線"
    },
    {
      detailId: 'detail-excretion-15e9ike',
      label: "扮演便座",
      roles: {
        active: {
          description: "讓對方扮演便座"
        },
        passive: {
          description: "扮演便座接受對方使用"
        }
      },
      warning: "注意感染風險、身體位置、清理與心理壓力"
    },
    {
      detailId: 'detail-excretion-36n9ra',
      label: "排泄展示/觀賞",
      roles: {
        active: {
          description: "觀看對方排泄或要求對方展示排泄"
        },
        passive: {
          description: "展示排泄給對方觀看"
        }
      },
      warning: null
    }
  ],
  behavior_restriction: [
    {
      detailId: 'detail-behavior_restriction-1q2915m',
      label: "限制自慰",
      roles: {
        active: {
          description: "限制對方自慰"
        },
        passive: {
          description: "被對方限制自慰"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-behavior_restriction-10wmuve',
      label: "限制性愛",
      roles: {
        active: {
          description: "限制對方進行性愛"
        },
        passive: {
          description: "被對方限制進行性愛"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-behavior_restriction-1v32uv6',
      label: "限制高潮",
      roles: {
        active: {
          description: "限制對方高潮"
        },
        passive: {
          description: "被對方限制高潮"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-behavior_restriction-1qutp1i',
      label: "限制排泄",
      roles: {
        active: {
          description: "限制對方排泄"
        },
        passive: {
          description: "被對方限制排泄"
        }
      },
      warning: "注意泌尿腸胃風險、身體不適與醫療風險"
    },
    {
      detailId: 'detail-behavior_restriction-7yynqx',
      label: "限制睡眠",
      roles: {
        active: {
          description: "限制對方睡眠"
        },
        passive: {
          description: "被對方限制睡眠"
        }
      },
      warning: "注意身心健康、判斷力下降與現實生活影響"
    },
    {
      detailId: 'detail-behavior_restriction-p66lsr',
      label: "限制進食",
      roles: {
        active: {
          description: "限制對方進食"
        },
        passive: {
          description: "被對方限制進食"
        }
      },
      warning: "注意營養不足、低血糖、飲食失調與健康風險"
    },
    {
      detailId: 'detail-behavior_restriction-p4j1x',
      label: "限制交友",
      roles: {
        active: {
          description: "限制對方交友或社交"
        },
        passive: {
          description: "被對方限制交友或社交"
        }
      },
      warning: "注意孤立風險、現實人際影響與權力濫用"
    },
    {
      detailId: 'detail-behavior_restriction-1jxhizx',
      label: "限制說話",
      roles: {
        active: {
          description: "限制對方說話"
        },
        passive: {
          description: "被對方限制說話"
        }
      },
      warning: "注意溝通需求、心理壓力與求助方式"
    },
    {
      detailId: 'detail-behavior_restriction-1st1nqk',
      label: "限制洗澡",
      roles: {
        active: {
          description: "限制對方洗澡或清潔"
        },
        passive: {
          description: "被對方限制洗澡或清潔"
        }
      },
      warning: "注意衛生、皮膚不適、氣味與現實生活影響"
    }
  ],
  other: [
    {
      detailId: 'detail-other-cx35l0',
      label: "掐脖子的呼吸控制",
      roles: {
        active: {
          description: "用掐脖子的方式限制對方呼吸"
        },
        passive: {
          description: "被對方用掐脖子的方式限制呼吸"
        }
      },
      warning: "注意窒息、昏厥、頸部傷害與停止方式"
    },
    {
      detailId: 'detail-other-81imh3',
      label: "埋進胸部的呼吸控制",
      roles: {
        active: {
          description: "讓對方埋進胸部以限制呼吸"
        },
        passive: {
          description: "被對方胸部包覆並限制呼吸"
        }
      },
      warning: "注意窒息、恐慌反應、姿勢壓迫與停止方式"
    },
    {
      detailId: 'detail-other-12ak8nk',
      label: "真空袋短暫窒息",
      roles: {
        active: {
          description: "用真空袋讓對方短暫進入窒息情境"
        },
        passive: {
          description: "在真空袋中短暫進入窒息情境"
        }
      },
      warning: "注意窒息、恐慌、昏厥與緊急解放方式"
    },
    {
      detailId: 'detail-other-11372gg',
      label: "水刑",
      roles: {
        active: {
          description: "對對方進行水刑情境"
        },
        passive: {
          description: "接受對方進行水刑情境"
        }
      },
      warning: "注意嗆水、窒息、恐慌與創傷觸發"
    },
    {
      detailId: 'detail-other-1weofdn',
      label: "催眠",
      roles: {
        active: {
          description: "對對方進行催眠或暗示"
        },
        passive: {
          description: "接受對方催眠或暗示"
        }
      },
      warning: "注意心理界線、暗示內容、撤回同意與事後回復"
    },
    {
      detailId: 'detail-other-67684a',
      label: "玩食物",
      roles: {
        active: {
          description: "用食物與對方進行情境互動"
        },
        passive: {
          description: "被對方用食物進行情境互動"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-other-6t50x3',
      label: "刺青",
      roles: {
        active: {
          description: "要求對方刺青或為對方安排刺青"
        },
        passive: {
          description: "接受對方要求或安排刺青"
        }
      },
      warning: "注意永久身體改變、感染、職場生活影響與後悔風險"
    },
    {
      detailId: 'detail-other-1k7dzxy',
      label: "烙印",
      roles: {
        active: {
          description: "在對方身上留下烙印"
        },
        passive: {
          description: "身體被對方留下烙印"
        }
      },
      warning: "注意燙傷、感染、疤痕、永久痕跡與醫療風險"
    },
    {
      detailId: 'detail-other-cpl0rm',
      label: "指定服裝穿著",
      roles: {
        active: {
          description: "指定對方穿著特定服裝"
        },
        passive: {
          description: "被對方指定穿著特定服裝"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-other-967tbj',
      label: "決定對方的食物",
      roles: {
        active: {
          description: "決定對方要吃的食物"
        },
        passive: {
          description: "由對方決定自己要吃的食物"
        }
      },
      warning: "注意過敏、營養、飲食限制與控制界線"
    },
    {
      detailId: 'detail-other-9c5xzq',
      label: "舔腳",
      roles: {
        active: {
          description: "要求對方舔自己的腳"
        },
        passive: {
          description: "舔對方的腳"
        }
      },
      warning: "注意足部衛生、口腔傷口、感染風險與心理界線"
    },
    {
      detailId: 'detail-other-1x8oaxq',
      label: "舔鞋",
      roles: {
        active: {
          description: "要求對方舔自己的鞋"
        },
        passive: {
          description: "舔對方的鞋"
        }
      },
      warning: "注意髒污、化學殘留、口腔傷口與感染風險"
    },
    {
      detailId: 'detail-other-yswhyo',
      label: "踩踏身體",
      roles: {
        active: {
          description: "踩踏對方身體"
        },
        passive: {
          description: "被對方踩踏身體"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-other-1cs7dja',
      label: "踩踏臉部",
      roles: {
        active: {
          description: "踩踏對方臉部"
        },
        passive: {
          description: "被對方踩踏臉部"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-other-1pwrugh',
      label: "灌食器使用",
      roles: {
        active: {
          description: "用灌食器餵食或灌食對方"
        },
        passive: {
          description: "被對方用灌食器餵食或灌食"
        }
      },
      warning: "注意嗆咳、誤吸、噎到、衛生與身體不適"
    },
    {
      detailId: 'detail-other-suxt6v',
      label: "種草莓",
      roles: {
        active: {
          description: "在對方身上留下吻痕"
        },
        passive: {
          description: "被對方在身上留下吻痕"
        }
      },
      warning: null
    },
    {
      detailId: 'detail-other-17kwb61',
      label: "摔角",
      roles: {
        active: {
          description: "與對方進行摔角式肢體互動"
        },
        passive: {
          description: "與對方進行摔角式肢體互動"
        }
      },
      warning: "注意跌倒、扭傷、撞擊、體型差與場地安全"
    },
    {
      detailId: 'detail-other-g75mw6',
      label: "打架",
      roles: {
        active: {
          description: "與對方進行打架式肢體互動"
        },
        passive: {
          description: "與對方進行打架式肢體互動"
        }
      },
      warning: "注意受傷風險、失控、保護部位與停止方式"
    },
    {
      detailId: 'detail-other-1q0idds',
      label: "綁架情境",
      roles: {
        active: {
          description: "安排或主導綁架情境角色扮演"
        },
        passive: {
          description: "參與被綁架的情境角色扮演"
        }
      },
      warning: "注意公開場合誤會、法律風險、恐慌反應與安全詞"
    }
  ]
};

export const questionBank: QuestionBank = {
  bankVersion: '2026-07-11',
  schemaVersion: 1,
  source: {
    fileId: '1shrEavMkoumIpe07vL3DXp0uj7tcHzqgPV6qzU6jvAE',
    kind: 'google-sheet',
    modifiedTime: '2026-07-11T06:14:45.603Z',
    title: 'BDSM boundary test items',
  },
  categories: [
    category('impact_spanking', '拍打類項目', '對對方進行包含打屁股在內的拍打相關衝擊遊戲', '接受包含打屁股在內的拍打相關衝擊遊戲', 24),
    category('whipping', '鞭打類項目', '對對方進行鞭打相關衝擊遊戲', '接受鞭打相關的衝擊遊戲', 15),
    category('bondage', '束縛類項目', '使用繩子或各種道具將對方拘束並限制行動的項目', '被繩子或各種道具拘束並限制行動的項目', 19),
    category('tickling', '搔癢類項目', '用手或各種道具，以造成對方癢感為目標的項目', '被對方用手或各種道具搔癢，以造成自身癢感為目標的項目', 16),
    category('pain_stimulation', '疼痛刺激類項目', '施予乳夾、滴蠟、電擊等疼痛刺激相關項目', '接受乳夾、滴蠟、電擊等疼痛刺激相關項目', 19),
    category('humiliation', '羞辱類項目', '用語言或行為貶低對方，或造成對方羞辱感的項目', '在語言或行為上被貶低，或感受到羞辱感的項目', 9),
    category('service', '服侍類項目', '接受各種服務，用以滿足自己生活所需或慾望', '提供各種服務，用以滿足對方生活所需或慾望', 11),
    category('discipline', '管教類項目', '限制或立下規範，以訓練並達成目標為主的項目', '接受限制或規範，並以訓練、改善或達成目標為主的項目', 12),
    category('sexual_interaction', '性愛類項目', '與性器官互動相關的項目', '與性器官互動相關的項目', 21),
    category('anal_interaction', '肛門類項目', '與肛門互動相關的項目', '與肛門互動相關的項目', 15),
    category('multi_party_interaction', '多方互動類項目', '如多人、或關係外第三人相關的項目', '如多人、或關係外第三人相關的項目', 11),
    category('enslavement', '奴化類項目', '讓對方扮演某種範圍內的奴隸的項目', '自己扮演某種範圍內奴隸的項目', 14),
    category('pet_play', '獸/寵物化類項目', '讓對方扮演獸/寵物相關的項目', '自己扮演獸或寵物相關的項目', 16),
    category('role_play', '角色扮演類項目', '引導對方進行情境扮演的項目', '自己進行情境扮演的項目', 14),
    category('objectification', '物化類項目', '在合意情境中，暫時把對方當作物品、家具或工具對待的項目', '在合意情境中，暫時被當作物品、家具或工具對待的項目', 11),
    category('exposure', '暴露類項目', '讓對方在各種情境下裸露身體的項目', '讓自己在各種情境下裸露身體的項目', 10),
    category('image_recording', '影像類項目', '拍攝、保存、傳送、公開或分享對方影像的項目', '自己被拍攝、保存、傳送、公開或分享影像的項目', 9),
    category('piercing_cutting', '穿刺/割類項目', '對對方或要求對方身體某處進行穿刺或刀割相關的項目', '在自己身體某處接受穿刺或刀割相關的項目', 11),
    category('excretion', '排泄類項目', '與排泄物相關的項目', '與排泄物相關的項目', 9),
    category('behavior_restriction', '行為限制類項目', '在合意下，限制對方的需求或偏好的項目', '在合意下，被限制自身需求或偏好的項目', 9),
    category('other', '其他', '如呼吸控制、催眠、玩弄食物等無法被分類的項目', '如呼吸控制、催眠、玩弄食物等無法被分類的項目', 19, false),
  ],
};

export function getCategoryQuestionId(categoryId: string, role: QuestionRole): string {
  return `category.${categoryId}.${role}`;
}

export function getDetailQuestionId(
  categoryId: string,
  detailId: string,
  role: QuestionRole,
): string {
  return `detail.${categoryId}.${detailId}.${role}`;
}

const categoryRoundCategories = questionBank.categories.filter(
  (entry) => entry.includeInCategoryRound,
);
const categoryRoundQuestions = (['active', 'passive'] as const).flatMap((role) =>
  categoryRoundCategories.map<CategoryQuestion>((entry) => ({
      category: entry,
      id: getCategoryQuestionId(entry.categoryId, role),
      level: 'category',
      role,
    })),
);

export const allCategoryQuestionDefinitions = categoryRoundQuestions.map(
  ({ id, level, role }) => ({ id, level, role }),
);

export const allDetailQuestionDefinitions = (['active', 'passive'] as const).flatMap((role) =>
  questionBank.categories.flatMap((category) =>
    category.detailItems.map(({ detailId }) => ({
      id: getDetailQuestionId(category.categoryId, detailId, role),
      level: 'detail' as const,
      role,
    })),
  ),
);

export const allQuestionDefinitions = [
  ...allCategoryQuestionDefinitions,
  ...allDetailQuestionDefinitions,
];

export const categoryQuestionsByScope: CategoryQuestionsByScope = {
  activeOnly: categoryRoundQuestions.filter((question) => question.role === 'active'),
  passiveOnly: categoryRoundQuestions.filter((question) => question.role === 'passive'),
  all: categoryRoundQuestions,
};

export function getCategoryQuestionsForScope(scope: SecretFileScope): readonly CategoryQuestion[] {
  return categoryQuestionsByScope[scope];
}

export function getDetailQuestionsForCategory(
  category: QuestionBankCategory,
  role: QuestionRole,
): readonly DetailQuestion[] {
  return category.detailItems.map((detail) => ({
    category,
    detail,
    id: getDetailQuestionId(category.categoryId, detail.detailId, role),
    level: 'detail',
    role,
  }));
}

export function getQuestionBankCounts(scope: SecretFileScope): QuestionBankCounts {
  const directionCount = scope === 'all' ? 2 : 1;
  const detailItemCount = questionBank.categories.reduce(
    (total, entry) => total + entry.itemCount,
    0,
  );

  return {
    categoryCount: questionBank.categories.filter((entry) => entry.includeInCategoryRound).length * directionCount,
    detailQuestionCount: detailItemCount * directionCount,
  };
}

export function getResultCategories(role: QuestionRole): readonly QuestionBankCategory[] {
  return questionBank.categories.filter(() => isRoleIncludedInScope(role, 'all'));
}
