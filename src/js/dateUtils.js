export class DateUtils {
  /**
   * @returns {string}
   */
  static getCurrentDateString() {
    const date = Temporal.Now.zonedDateTimeISO();
    return date.toPlainDate().toString();
  }
}
