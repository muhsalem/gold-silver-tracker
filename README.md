# نِصاب — Gold & Silver Nisab Tracker

موقع وقفي مجاني يحسب قيمة نصاب الزكاة يومياً بأسعار الذهب والفضة الحيّة وبعملة كل دولة، مع التركيز على الدول الإسلامية.

## المزايا

- **النصاب اليومي**: نصاب الذهب (٨٥ جراماً) والفضة (٥٩٥ جراماً) بعملة الدولة المختارة، مع سعر الجرام لكل عيار والتاريخ الهجري لليوم.
- **حاسبة الزكاة**:
  - تشمل النقد وعروض التجارة والأسهم والديون والذهب والفضة.
  - فيها خيار حكم الحُليّ المستعمل (مذهب الحنفية أو الجمهور)، والاختيار بين نصاب الذهب ونصاب الفضة.
  - تحتسب أسهم الاستثمار طويل الأجل بحسب نسبة الموجودات الزكوية في الشركة.
- **الحَوْل**: تاريخ بلوغ النصاب، وموعد الزكاة القادم وفق تقويم أم القرى، مع خيار السنة الميلادية بمقدار ٢٫٥٧٧٪.
- **السجل التاريخي**: رسم بياني لقيمة النصاب بسعر صرف كل تاريخ، ومنه نطاق يبدأ من ١ محرّم ١٤٤٨هـ.
- **أنواع الزكاة**:
  - أنصبة الأنعام، ويستمر الحساب بعد الجداول.
  - الزروع وزكاة الفطر والركاز والمعادن.
  - أحكام المذاهب الأربعة.
- **الأسعار اليدوية**: يمكن إدخال أسعار السوق المحلية، وتُحفظ على الجهاز وحده.
- **اللغات**: العربية والإنجليزية والفرنسية والتركية والإندونيسية والأردية.

> الموقع أداة حساب استرشادية وليس فتوى.

## مصادر البيانات

| البيان                  | المصدر                                  |
| ----------------------- | --------------------------------------- |
| سعر الذهب والفضة الفوري | gold-api.com                            |
| أسعار الصرف اليومية     | open.er-api.com                         |
| السجل التاريخي          | Yahoo Finance (`GC=F`, `SI=F`, `XXX=X`) |

إذا تعطّل مصدر الأسعار، يعرض الخادم آخر سعر ناجح بتاريخه الأصلي.

## التطوير

```sh
npm i
npm run dev     # خادم التطوير
npm test        # اختبارات الحسابات (node:test)
npm run lint
npm run build
```

المنطق الأساسي في:

- `src/lib/nisab.ts`: الأنصبة والعيارات والأنعام.
- `src/lib/hijri.ts`: التقويم الهجري والحَوْل.
- `src/lib/fiqh.ts`: أقوال المذاهب.
- `src/lib/prices.functions.ts`: دوال الخادم لجلب الأسعار.

## Lovable

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/65edb8ff-d2ad-49d1-93d5-65f50ba5d217).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
