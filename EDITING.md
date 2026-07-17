# Editing your website — a friendly guide

Hi Dr. Goodwin! This guide shows you how to change the words on your website
yourself — no developer needed. You can update headlines, paragraphs, lists,
prices, the FAQ, testimonials, and contact info, all from **one file**.

You never need to install anything. Everything happens in your web browser on
github.com.

---

## The one file you edit

Everything you can see and read on the site lives in a single file:

> **`src/content/site-content.ts`**

Pages just borrow their text from this file, so this is the only place you
ever need to change words.

---

## How editing works (the big picture)

1. Open the file on github.com and click the pencil ✏️ to edit.
2. Change the text **between the quotation marks**.
3. Save (GitHub calls this "Commit changes").
4. Vercel automatically rebuilds your live site — usually within a couple of
   minutes.

That's the whole loop. Let's walk through it slowly the first time.

---

## Step-by-step: change some text

1. Go to your repository on **github.com** and sign in.
2. Click the folders to open **`src`** → **`content`**, then click
   **`site-content.ts`**.
3. Near the top-right of the file, click the **pencil icon** (✏️, "Edit this
   file").
4. Find the text you want to change. Use your browser's Find (**Ctrl+F** on
   Windows, **Cmd+F** on Mac) and type a few words of what you're looking for.
5. Carefully change **only the words inside the quotation marks**. For example:

   ```
   heading: "Meet Dr. Goodwin",
   ```

   You can safely change it to:

   ```
   heading: "Get to know Dr. Goodwin",
   ```

6. Scroll to the bottom and click the green **Commit changes** button. You can
   leave the default message or type a short note like "Updated about heading".
7. Wait a minute or two, then refresh your live website. Done!

---

## The golden rules (what's safe, what to avoid)

✅ **Safe to change:** any words **inside** the `"quotation marks"`.

⚠️ **Please don't touch** these — they keep the site working:

- The **quotation marks** themselves `" "`. Every piece of text needs one at
  the start and one at the end.
- The **commas** `,` at the end of lines.
- The **square brackets** `[ ]` and **curly braces** `{ }`.
- The **labels before the colon**, like `heading:` or `price:`. Change the text
  after them, not the label itself.
- The grey **comment lines** that start with `//`. These are just notes to help
  you — changing them does nothing, and deleting them loses the guidance.

A tiny example, with the parts labeled:

```
   title: "Menopause",
   ^^^^^    ^^^^^^^^^
   leave    change this
   this
```

### Apostrophes and quotes inside your text

The text uses straight double quotes `"` to wrap each phrase. If your text
needs an apostrophe (like "women's"), that's fine — an apostrophe is a single
quote `'` and won't confuse anything. Just avoid typing a double quote `"`
**inside** your text, because the site would think your text ended early. If
you need a quotation mark inside text, ask your developer.

### If something looks broken

Don't worry — you can't permanently break anything. GitHub keeps every past
version. If a change causes a problem, you (or your developer) can undo it from
the repository's history. When in doubt, make one small change at a time so
it's easy to see what did what.

---

## Where each part of the site lives in the file

The file is organized top-to-bottom, roughly in the order things appear on the
site. Here's the map:

| In the file (look for this label) | Where it shows up on the site |
| --- | --- |
| `carePlanPricing` (very top) | The care-plan **prices** ($175/month, 13 payments, 5% upfront discount). These are **numbers**, so change only the number — no quotes, no `$`. |
| `brand` | Practice name, tagline, description, email, and the fine print in the footer |
| `nav` | The menu links at the top and the main button text |
| `home.hero` | The big headline and buttons at the very top of the home page |
| `home.philosophy` | The "more than hot flashes" section and its grid |
| `home.whatWeTreat` | The grid of conditions you treat |
| `home.testosterone` | The "women need testosterone too" section |
| `home.howToJoin` | The **3 steps** to join |
| `home.carePlan` | What's included in the care plan **and** the pricing box |
| `home.testimonials` | The patient quotes that rotate near the bottom |
| `home.faq` | The frequently asked questions |
| `home.finalCta` | The closing call-to-action band |
| `about` | Everything on the About page (bio, quote, credentials) |
| `book` | The "Request More Information" / booking page |
| `footer` | The small headings in the footer |
| `legalPages` | The words shown on the Privacy Policy and Terms of Service pages |
| `placeholderPage` | The "Back to Home" button and "Questions?" email line on those legal pages |
| `legalLinks` | The Privacy Policy and Terms links at the very bottom |

---

## A few notes specific to your practice

- **Prices:** The care-plan pricing shown on the site is calculated from the
  three numbers at the very top of the file (`monthlyPayment`, `paymentCount`,
  `upfrontDiscountPercent`). Change the number there and every price on the site
  updates automatically — you don't type dollar amounts anywhere else.
- **Financing:** Cherry is the only financing partner mentioned. Please keep it
  that way in any copy you write.
- **California only:** The practice serves patients located in California.
  Please don't add other states.
- **Placeholders:** Anything written in `[SQUARE BRACKETS AND CAPITALS]` is a
  reminder that a real value is still needed. Replace the whole placeholder,
  brackets and all, once you have the confirmed information.
- **Testimonials:** The three quotes in `home.testimonials` are examples.
  Replace them with real, patient-approved quotes when you have them.

---

## Adding or removing list items (optional, slightly advanced)

Some sections are **lists** — like the conditions you treat, the care-plan
inclusions, or the FAQ. Each item sits between `{ }` and ends with a comma.
To **remove** one, delete the whole `{ ... },` block (including its comma). To
**add** one, copy an existing block, paste it right after, and change the text.
Keep the pattern identical — same labels, same quotes, same commas. If that
feels risky, it's a perfect small task to hand to your developer.

---

That's it. When in doubt: change only what's inside the quotes, save, and check
the live site. You've got this.
