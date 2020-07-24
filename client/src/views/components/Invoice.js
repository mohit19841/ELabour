import React, { useEffect, useState } from "react";

import ErrorMessage from "./ErrorMessage";

const Invoice = ({ data }) => {
  const [invoiceData, setInvoiceData] = useState();

  const getTotal = (subtotal, recruitmentFee) => {
    let total = parseFloat(subtotal) + parseFloat(recruitmentFee);
    return total.toFixed(2);
  };

  const getRecruitmentFee = (fee, subtotal) => {
    let recruitmentFee = fee * subtotal;
    return recruitmentFee.toFixed(2);
  };

  const getSubtotal = (duration, labourers) => {
    let subtotal = 0;
    labourers.forEach((l) => {
      subtotal += parseFloat(getSkillTotal(l.rate, l.quantity, duration));
    });
    return subtotal.toFixed(2);
  };

  const getSkillTotal = (rate, quantity, duration) => {
    let billableHours = duration * 8 * quantity;
    let total = billableHours * rate;
    return total.toFixed(2);
  };

  const getDateString = (date) => {
    const y = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
    const m = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
    const d = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
    return `${d}-${m}-${y}`;
  };

  useEffect(() => {
    if (data) {
      setInvoiceData({
        ...data,
        labourers: data.labourers.map((labourer) => {
          return {
            type: labourer.type,
            rate: labourer.rate,
            quantity: labourer.quantity,
            total: getSkillTotal(
              labourer.rate,
              labourer.quantity,
              data.duration
            ),
          };
        }),
        subtotal: getSubtotal(data.duration, data.labourers),
        recruitmentFee: getRecruitmentFee(
          0.2,
          getSubtotal(data.duration, data.labourers)
        ),
        total: getTotal(
          getSubtotal(data.duration, data.labourers),
          getRecruitmentFee(0.2, getSubtotal(data.duration, data.labourers))
        ),
      });
    }
  }, []);

  return !invoiceData ? (
    <ErrorMessage message={"No invoice available"} />
  ) : (
    <div className="row">
      <div className="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="card">
          <div className="card-header p-4">
            <div>
              <h3 className="mb-0">{invoiceData.job}</h3>
              <p className="mt-1">
                {invoiceData.isComplete ? "Completed" : "In Progress"}
              </p>
            </div>
          </div>
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-sm-6">
                <h5 className="mb-3">From:</h5>
                <h3 className="text-dark mb-1">Labour Hier</h3>

                <div>555 Seymour Street</div>
                <div>Vancouver, British Columbia</div>
              </div>
              <div className="col-sm-6">
                <h5 className="mb-3">To:</h5>
                <h3 className="text-dark mb-1">{invoiceData.client.name}</h3>
                <div>{invoiceData.client.address}</div>
                <div>{invoiceData.client.phone}</div>
              </div>
            </div>
            <div className="table-responsive-sm">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Labourer Type</th>
                    <th className="right">Hourly Rate</th>
                    <th className="center"># Hired</th>
                    <th className="right text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.labourers.map((labourer, i) => {
                    return (
                      <tr key={i}>
                        <td className="left strong">{labourer.type}</td>
                        <td className="right">{`$${labourer.rate}`}</td>
                        <td className="center">{labourer.quantity}</td>
                        <td className="right text-right">{`$${labourer.total}`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="row mt-3">
              <div className="col-lg-6 col-sm-5"></div>
              <div className="col-lg-6 col-sm-5 ml-auto">
                <table className="table table-clear">
                  <tbody>
                    <tr>
                      <td className="left">
                        <strong className="text-dark">Subtotal</strong>
                      </td>
                      <td className="right text-right">
                        {`$${invoiceData.subtotal}`}
                      </td>
                    </tr>
                    <tr>
                      <td className="left">
                        <strong className="text-dark">
                          Recruitment Fee (20%)
                        </strong>
                      </td>
                      <td className="right text-right">
                        {`$${invoiceData.recruitmentFee}`}
                      </td>
                    </tr>
                    <tr>
                      <td className="left">
                        <strong className="text-dark">Total</strong>
                      </td>
                      <td className="right text-right">
                        <strong className="text-dark">
                          {`$${invoiceData.total}`}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="card-footer bg-white">
            <p className="mb-0">Labour Hier</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
