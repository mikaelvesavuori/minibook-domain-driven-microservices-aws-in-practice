/**
 * BACKEND
 */

class DbRepository {
  orders: any[];

  constructor() {
    this.orders = [];
  }

  createSomething(order: string) {
    this.orders.push(order);
  }

  getSomething() {
    return this.orders;
  }

  updateSomething() {}

  deleteSomething() {}
}

const db = new DbRepository();

///////////////

class OrderService {
  //orders: any[];
  repo: DbRepository;

  constructor(repo: DbRepository) {
    //this.orders = [];
    this.repo = repo;
  }

  public orderCar(order: string) {
    // 1. validate order
    this.validate(order);
    // 2. place order
    this.createOrder(order);
    // 3. etc
    return this.getOrders();
  }

  private createOrder(order: string) {
    //this.orders.push(id);
    this.repo.createSomething(order);
  }

  private getOrders() {
    const orders = this.repo.getSomething();
    console.log(orders);
    return orders;
  }

  private validate(order: any) {
    if (order) return true;
    return false;
  }
}

/**
 * CLIENT
 */

function api() {
  const orderService = new OrderService(db);
  const order = orderService.orderCar("8097f8h2");
  console.log(order);
}

api();
