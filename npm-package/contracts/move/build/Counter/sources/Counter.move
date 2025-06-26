module example::Counter {
    use std::signer;

    struct Counter has key, store {
        value: u64,
    }

    /// Initializes a Counter resource under the signer’s address.
    /// (Re-runs safely thanks to the `exists` guard.)
    public entry fun initialize(account: &signer) {
        if (!exists<Counter>(signer::address_of(account))) {
            move_to(account, Counter { value: 0 });
        }
    }

    /// Increments the stored counter by 1.
    public entry fun increment(account: &signer) acquires Counter {
        let ctr = borrow_global_mut<Counter>(signer::address_of(account));
        ctr.value = ctr.value + 1;
    }

    public entry fun get(account: address): u64 acquires Counter {
        borrow_global<Counter>(account).value
    }
}
