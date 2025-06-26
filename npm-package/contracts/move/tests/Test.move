address example {
  module CounterTest {
    use std::signer;
    use example::Counter;

    #[test(a = @0x1)]
    fun test_initialize_and_increment(a: signer) {
      // initialize
      Counter::initialize(&a);

      // reading via the signer’s address
      let addr = signer::address_of(&a);
      let initial = Counter::get(addr);
      assert!(initial == 0, 1);

      // incrementing the counter
      Counter::increment(&a);
      let after = Counter::get(addr);
      assert!(after == 1, 2);
    }
  }
}
