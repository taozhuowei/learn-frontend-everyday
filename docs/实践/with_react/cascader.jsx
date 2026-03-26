/**
 * @description 三级联动选择器，支持省市区选择
 * @approach
 * 先明确输入输出，再按稳定步骤展开实现。
 * 优先使用清晰变量名、显式分支和可读循环，避免技巧式缩写。
 * @params
 * 请在函数签名中明确列出入参含义。
 * @return
 * * {JSX.Element} 级联选择器
 */
import { useState } from "react";

const areaData = [
  {
    id: 1,
    name: "辽宁省",
    children: [
      {
        id: 11,
        name: "沈阳市",
        children: [
          { id: 111, name: "和平区" },
          { id: 112, name: "沈河区" },
          { id: 113, name: "皇姑区" },
        ],
      },
      {
        id: 12,
        name: "大连市",
        children: [
          { id: 121, name: "中山区" },
          { id: 122, name: "西岗区" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "山东省",
    children: [
      {
        id: 21,
        name: "济南市",
        children: [
          { id: 211, name: "历下区" },
          { id: 212, name: "市中区" },
        ],
      },
    ],
  },
];

const LEVEL_COUNT = 3;
export default function Cascader() {
  const [selected, setSelected] = useState([]);

  const getOptionsByLevel = (level) => {
    if (level === 0) return areaData;

    if (level === 1) {
      const pid = selected[0];
      const province = areaData.find((item) => item.id === pid);
      return province?.children || [];
    }

    if (level === 2) {
      const pid = selected[0];
      const cid = selected[1];
      const province = areaData.find((item) => item.id === pid);
      const city = province?.children?.find((item) => item.id === cid);
      return city?.children || [];
    }

    return [];
  };

  const handleChange = (val, level) => {
    const newSelected = [...selected];
    newSelected[level] = val;

    for (let i = level + 1; i < LEVEL_COUNT; i++) {
      newSelected[i] = undefined;
    }

    setSelected(newSelected);
  };

  const getSelectedText = () => {
    const names = [];
    let list = areaData;
    for (let i = 0; i < LEVEL_COUNT; i++) {
      const id = selected[i];
      const item = list.find((it) => it.id === id);
      if (item) {
        names.push(item.name);
        list = item.children || [];
      } else {
        break;
      }
    }
    return names.join(" / ");
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>级联选择器</h3>
      <div style={{ display: "flex", gap: 10 }}>
        {Array.from({ length: LEVEL_COUNT }).map((_, level) => (
          <select
            key={level}
            value={selected[level] || ""}
            onChange={(e) => handleChange(Number(e.target.value), level)}
          >
            <option value="">请选择</option>
            {getOptionsByLevel(level).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        ))}
      </div>
      <p>已选择: {getSelectedText() || "未选择"}</p>
    </div>
  );
}
