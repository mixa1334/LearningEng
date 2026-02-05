class StringHelper {

  truncate(str: string, maxLength: number = 5): string {
    return str.length > maxLength ? str.substring(0, maxLength - 2) + ".." : str;
  }

  trim(text: string): string {
    return text.replaceAll(/(\r\n|\n|\r)/g, " ").trim();
  }

  processTextBeforeSaving(text: string, maxLength: number = 15): string {
    return this.trim(this.truncate(text, maxLength));
  }
}

export const stringHelper = new StringHelper();

