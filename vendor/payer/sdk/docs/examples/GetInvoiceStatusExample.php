<?php
/**
 * Copyright 2016 Payer Financial Services AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * PHP version 5.3
 *
 * @package   Payer_Sdk
 * @author    Payer <teknik@payer.se>
 * @copyright 2016 Payer Financial Services AB
 * @license   http://www.apache.org/licenses/LICENSE-2.0 Apache license v2.0
 */

require_once "PayerCredentials.php";
require_once "../../vendor/autoload.php";

use Payer\Sdk\Client;
use Payer\Sdk\Resource\Invoice;

use Payer\Sdk\Transport\Http\Response;

$data = array(
    'invoice_number' => '' // The number of the invoice to fetch
);

try {
    $gateway = Client::create($credentials);

    $invoice = new Invoice($gateway);

    // Fetch the order status
    $getInvoiceResponse = $invoice->getStatus($data);

    var_dump($getInvoiceResponse);

    $invoiceNumber =    $getInvoiceResponse['invoice_number'];
    $orderNumber =      $getInvoiceResponse['order_number'];
    $transactionId =    $getInvoiceResponse['transaction_id'];

    $customerId =       $getInvoiceResponse['customer']['id'];
    $userId =           $getInvoiceResponse['customer']['user_id'];

    $totalAmount =      $getInvoiceResponse['total_amount'];
    $roundingAmount =   $getInvoiceResponse['rounding_amount'];
    $toPayAmount =      $getInvoiceResponse['to_pay_amount'];
    $invoiceDate =      $getInvoiceResponse['invoice_date'];
    $dueDate =          $getInvoiceResponse['due_date'];
    $paidDate =         $getInvoiceResponse['paid_date'];
    $events =            $getInvoiceResponse['events'];
    $options =          $getInvoiceResponse['options'];
    $deliveryType =     $getInvoiceResponse['delivery_type'];

} catch (PayerException $e) {
    var_dump($e);
}