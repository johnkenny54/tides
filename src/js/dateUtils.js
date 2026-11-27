export class DateUtils {
  /**
   * @returns {string}
   */
  static getCurrentDateString() {
    const date = Temporal.Now.zonedDateTimeISO();
    return date.toPlainDate().toString();
  }

  /**
   * @param {string} date
   * @param {number} increment
   */
  static incrementDateString(date, increment) {
    const d = Temporal.PlainDate.from(date);
    const dNew = d.add({ days: increment });
    return dNew.toString();
  }
}
