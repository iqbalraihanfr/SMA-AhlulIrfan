<button <?php echo e($attributes->merge(['type' => 'submit'])->class(
    'inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-on-brand
     transition hover:bg-brand-strong disabled:opacity-50'
)); ?>>
    <?php echo e($slot); ?>

</button>
<?php /**PATH /Users/iqbalrei/Projects/KKN/SMA-AhlulIrfan/resources/views/components/primary-button.blade.php ENDPATH**/ ?>