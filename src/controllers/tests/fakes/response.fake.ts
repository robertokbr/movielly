export class ResponseFake {
  public jsonResult: any;

  public status(_: number) {
    return this;
  }

  public json(data: any) {
    this.jsonResult = data;
    return this;
  }
}
