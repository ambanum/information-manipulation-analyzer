import Breadcrumb from 'modules/Common/components/Breadcrumb/Breadcrumb';
import BreadcrumbItem from 'modules/Common/components/Breadcrumb/BreadcrumbItem';
import Layout from 'modules/Embassy/components/Layout';
import React from 'react';
import { useRouter } from 'next/router';

export default function LegalNotice() {
  const router = useRouter();

  return (
    <Layout title="Legal Notice - Information Manipulation Analyzer">
      <div className="fr-container fr-container-fluid">
        <div className="fr-grid-row">
          <div className="fr-col fr-col-12 ">
            <Breadcrumb>
              <BreadcrumbItem href=" " onClick={() => router.back()}>
                Back
              </BreadcrumbItem>
              <BreadcrumbItem isCurrent={true}>Legal Notice</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </div>
      </div>

      <div className="fr-container fr-container-fluid fr-my-2w">
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col fr-col-12 fr-col-sm-12 fr-col-md-12 fr-col-lg-10 fr-col-xl-10">
            <h1>Legal Notice</h1>
            <h2>Editor</h2>
            <p>
              Office of the Ambassador for Digital Affairs
              <br />
              Ministère de l’Europe et des affaires étrangères
              <br />
              37 Quai d’Orsay, 75015 Paris, France
            </p>
            <h2>Editorial Director</h2>
            <p>Ambassador for Digital Affairs, Henri Verdier.</p>

            <h2>Hosting provider</h2>
            <p>
              https://www.ovhtelecom.fr/
              <br />
              2 rue Kellermann, 59100 Roubaix, France
              <br />
              +33 1007
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
